import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Icon, Modal, ModalProps, Radio, TextArea } from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';
import Swal from 'sweetalert2';

import { isError, submitPitchClaim } from '../../../api';
import { getAggregatedPitch } from '../../../api/pitch';
import { useAuth, useTeams } from '../../../contexts';
import { emptyAggregatePitch } from '../../../utils/constants';
import { convertMap, getPitchTeams, getUserFullName, pluralize } from '../../../utils/helpers';
import FieldTag from '../../FieldTag';
import LinkDisplay from '../../LinkDisplay';
import PitchCard from '../../PitchCard';
import UserChip from '../../UserChip';
import UserPicture from '../../UserPicture';
import './styles.scss';

interface ClaimPitchProps extends ModalProps {
  pitch: IPitch;
  callback(): void;
}

const ClaimPitchModal: FC<ClaimPitchProps> = ({
  pitch,
  callback,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkboxes, setCheckboxes] = useState(new Map<string, boolean>());
  const [longAnswer, setLongAnswer] = useState('');
  const [didSubmit, setDidSubmit] = useState(false);
  const [isCheckboxError, setIsCheckboxError] = useState(false);
  const [aggregatedPitch, setAggregatedPitch] = useState(emptyAggregatePitch);

  const { user } = useAuth();
  const { getTeamFromId } = useTeams();

  const teamMap = new Map<string, Partial<IUser>[]>();
  aggregatedPitch.aggregated.assignmentContributors.map(({ user, teams: teamIds }) => {
    for (const teamId of teamIds) {
      const teamList = teamMap.get(teamId) ?? [];
      teamList.push(user);
      teamMap.set(teamId, teamList);
    }
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const fetchAggregatedPitch = async (id: string): Promise<void> => {
      const res = await getAggregatedPitch(id);

      if (!isError(res)) {
        setAggregatedPitch(res.data.result);
      }
    };

    fetchAggregatedPitch(pitch._id);

    const map = new Map<string, boolean>();

    pitch.teams.map(({ teamId }) => {
      map.set(teamId, false);
    });

    setCheckboxes(map);
  }, [isOpen, pitch.teams, pitch._id]);

  const updateCheckboxes = (checkbox: string): void => {
    const isChecked = checkboxes.get(checkbox);

    checkboxes.set(checkbox, !isChecked);

    setCheckboxes(new Map(checkboxes));
  };

  const claimPitch = async (): Promise<void> => {
    setDidSubmit(true);

    if (!isValidForm()) {
      return;
    }
    const selectedTeams: string[] = [];
    checkboxes.forEach((selected, team) => {
      if (selected) {
        selectedTeams.push(team);
      }
    });

    const pitchRes = await submitPitchClaim(pitch._id, user._id, selectedTeams);
    if (!isError(pitchRes)) {
      callback();
      Swal.fire({
        title: 'Successfully submitted claim for pitch!',
        icon: 'success',
      });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const somethingIsChecked = convertMap(checkboxes).every(
      (checkbox) => !checkbox.value,
    );
    setIsCheckboxError(didSubmit && somethingIsChecked);
  }, [checkboxes, didSubmit]);

  const isValidForm = (): boolean =>
    convertMap(checkboxes).some((checkbox) => checkbox.value);

  const didUserClaim = (): boolean =>
    pitch.assignmentContributors.some(({ userId }) => user._id === userId);

  const didUserSubmitClaimReq = (): boolean =>
    pitch.pendingContributors.some(({ userId }) => user._id === userId);

  const getHeader = (): string => {
    if (didUserClaim()) {
      return 'You have already claimed this pitch!';
    } else if (didUserSubmitClaimReq()) {
      return 'You have already submitted your claim for this pitch';
    }

    return 'Claim Pitch';
  };

  const { author, reviewedBy, assignmentContributors, teams } =
    aggregatedPitch.aggregated;

  const isUserOnTeam = (team: string): boolean => user.teams.includes(team);
  const disableCheckbox = (team: string): boolean => !isUserOnTeam(team);

  const getOtherContributors = () => {
    if (teamMap.size === 0) {
      return <p>There are no other contributors on this pitch.</p>
    }

    return [...teamMap.entries()].map(([ teamId, users ]) => (
      <p key={teamId}><span style={{fontWeight: 'bold'}}>{getTeamFromId(teamId)?.name}</span>: {
        users.map((user, i) => (
          <UserChip user={user as IUser} key={i} />
        ))}
      </p>
    ));
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<PitchCard pitch={pitch} />}
      className="claim-modal"
      {...rest}
    >
      <Modal.Header>
        <div className="modal-header">
          {getHeader()}
          <Icon name="close" onClick={() => setIsOpen(false)} />
        </div>
      </Modal.Header>
      <Modal.Content>
        <h1 className="pitch-title">
          {pitch.title}
          <LinkDisplay href={pitch.assignmentGoogleDocLink} />
        </h1>
        <div className="topics-section">
          {aggregatedPitch.aggregated.interests.map((interest, index) => (
            <FieldTag
              key={index}
              name={interest.name}
              hexcode={interest.color}
            />
          ))}
        </div>
        <p className="description">{pitch.description}</p>
        <details className="contributors">
          <summary className="contributors-summary"><h4>Contributors Currently on Pitch</h4></summary>
          <h4>Other Contributors Currently on Pitch</h4>
          <hr></hr>
          {getOtherContributors()}
        </details>
        <Form>
          <Form.Group className="team-select-group">
              <p className="select-team-message">Select Team(s) to Join</p>
              {aggregatedPitch.aggregated.teams.map((team, i) => (
                  <div className="checkbox-wrapper" key={i}>
                    {aggregatedPitch.aggregated.teams.length === 1
                      ? <Form.Radio
                          disabled={team.target <= 0 || disableCheckbox(team._id)}
                          checked={checkboxes.get(team._id)}
                          onClick={() => {
                            updateCheckboxes(team._id);
                            setDidSubmit(false);
                          }}
                          error={isCheckboxError}
                        />
                      : <Form.Checkbox
                          disabled={team.target <= 0 || disableCheckbox(team._id)}
                          checked={checkboxes.get(team._id)}
                          onClick={() => {
                            updateCheckboxes(team._id);
                            setDidSubmit(false);
                          }}
                          error={isCheckboxError}
                        />
                    }
                    <p><span style={{fontWeight: 'bold'}}>{team.name}</span> - {team.target} {pluralize('spot', team.target)} left</p>
                  </div>
              ))}
          </Form.Group>
          <h4>Why are you a good fit for this story?</h4>
          <Form.TextArea rows={4} value={longAnswer} onChange={(e) => setLongAnswer(e.target.value)} maxLength={250} />
          <p className="word-limit">{longAnswer.length} / 250</p>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          onClick={claimPitch}
          content="Submit Claim Request"
          secondary
          disabled={didUserClaim() || didUserSubmitClaimReq()}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ClaimPitchModal;

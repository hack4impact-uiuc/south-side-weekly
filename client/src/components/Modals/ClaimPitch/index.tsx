import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Modal, ModalProps } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import Swal from 'sweetalert2';

import { isError, submitPitchClaim } from '../../../api';
import { getAggregatedPitch } from '../../../api/pitch';
import { useAuth } from '../../../contexts';
import { emptyAggregatePitch } from '../../../utils/constants';
import { convertMap, getUserFullName } from '../../../utils/helpers';
import FieldTag from '../../FieldTag';
import PitchCard from '../../PitchCard';
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
  const [didSubmit, setDidSubmit] = useState(false);
  const [isCheckboxError, setIsCheckboxError] = useState(false);
  const [aggregatedPitch, setAggregatedPitch] = useState(emptyAggregatePitch);

  const { user } = useAuth();

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

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<PitchCard pitch={pitch} />}
      className="claim-modal"
      {...rest}
    >
      <Modal.Header content={getHeader()} />
      <Modal.Content>
        <h1>{pitch.title}</h1>
        <div className="topics-section">
          {aggregatedPitch.aggregated.interests.map((interest, index) => (
            <FieldTag
              key={index}
              name={interest.name}
              hexcode={interest.color}
            />
          ))}
        </div>
        <div className="author-section">
          <div className="author">
            <h3>{`Submitted by: ${getUserFullName(author)}`}</h3>
          </div>
          <div className="author">
            <h3>{`Reviewed by: ${getUserFullName(reviewedBy)}`}</h3>
          </div>
        </div>
        <p className="description">{pitch.description}</p>
        <p>
          Link to Pitch:{' '}
          <a href={pitch.assignmentGoogleDocLink}>
            {pitch.assignmentGoogleDocLink}
          </a>
        </p>
        <h2>Positions Available Per Team:</h2>
        <p>
          Please select the team that you will be filling the position for
          before claiming this pitch.
        </p>
        <Form>
          <Form.Group inline widths={5} className="team-select-group">
            {teams.map((team, index) => (
              <div className="checkbox-wrapper" key={index}>
                <Form.Checkbox
                  disabled={
                    team.target <= 0 ||
                    disableCheckbox(pitch.teams[index].teamId)
                  }
                  checked={checkboxes.get(pitch.teams[index].teamId)}
                  onClick={() => {
                    updateCheckboxes(pitch.teams[index].teamId);
                    setDidSubmit(false);
                  }}
                  error={isCheckboxError}
                />
                <FieldTag name={team.name} hexcode={team.color} />
                <h4>{team.target}</h4>
              </div>
            ))}
          </Form.Group>
        </Form>
        <h2>Pitch Claimed By</h2>
        <div className="contributors-section">
          {assignmentContributors.map(({ user: contributor }, index) => (
            <UserPicture
              user={contributor}
              title={getUserFullName(contributor)}
              key={index}
              size="tiny"
            />
          ))}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          onClick={claimPitch}
          content="Submit my Claim for Review"
          positive
          disabled={didUserClaim() || didUserSubmitClaimReq()}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ClaimPitchModal;

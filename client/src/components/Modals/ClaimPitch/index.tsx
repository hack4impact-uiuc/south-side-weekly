import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Form, Grid, Modal, ModalProps } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import Swal from 'sweetalert2';
import { isError, submitPitchClaim } from '../../../api';
import { getAggregatedPitch } from '../../../api/pitch';
import { useAuth } from '../../../contexts';
import { emptyAggregatePitch, emptyPitch } from '../../../utils/constants';
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
  const [teamSlots, setTeamSlots] = useState<IPitch['teams']>(emptyPitch.teams);
  const [checkboxes, setCheckboxes] = useState(new Map<string, boolean>());
  const [didSubmit, setDidSubmit] = useState(false);
  const [isCheckboxError, setIsCheckboxError] = useState(false);
  const [aggregatedPitch, setAggregatedPitch] = useState(emptyAggregatePitch);

  const { user } = useAuth();

  const fetchAggregatedPitch = useCallback(
    async (id: string): Promise<void> => {
      const res = await getAggregatedPitch(id);

      if (!isError(res)) {
        setAggregatedPitch(res.data.result);
      }
    },
    [pitch._id],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    fetchAggregatedPitch(pitch._id);

    setTeamSlots(pitch.teams);

    const map = new Map<string, boolean>();

    pitch.teams.map(({ teamId }) => {
      map.set(teamId, false);
    });

    setCheckboxes(map);
  }, [isOpen, pitch.teams, getAggregatedPitch]);

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
    pitch.assignmentContributors
      .map(
        (assignmentContributer) =>
          assignmentContributer?.userId || assignmentContributer,
      )
      .includes(user._id);

  const didUserSubmitClaimReq = (): boolean =>
    pitch.pendingContributors
      .map((pendingContributer) => pendingContributer?.userId)
      .includes(user._id);

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
        <Grid className="topics-section" columns={6}>
          {pitch.topics.map((topic, index) => (
            <Grid.Column key={index}>
              <FieldTag content={topic} />
            </Grid.Column>
          ))}
        </Grid>
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
            {teamSlots.map((team, index) => (
              <div className="checkbox-wrapper" key={index}>
                <Form.Checkbox
                  disabled={
                    (team.target <= 0 && !checkboxes.get(team.teamId)) ||
                    didUserClaim() ||
                    didUserSubmitClaimReq()
                  }
                  checked={checkboxes.get(team.teamId)}
                  onClick={() => {
                    updateCheckboxes(team.teamId);
                    setDidSubmit(false);
                  }}
                  error={isCheckboxError}
                />
                <FieldTag
                  content={teams.find(({ _id }) => _id === team.teamId)?.name}
                />
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

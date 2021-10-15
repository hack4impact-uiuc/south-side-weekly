import { isEmpty } from 'lodash';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Form, Grid, Modal, ModalProps } from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';
import Swal from 'sweetalert2';

import { getUser, isError, updatePitch, submitPitchClaim } from '../../../api';
import { useAuth } from '../../../contexts';
import { emptyPitch } from '../../../utils/constants';
import { convertMap, getUserFullName } from '../../../utils/helpers';
import PitchCard from '../../PitchCard';
import FieldTag from '../../FieldTag';
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
  const [author, setAuthor] = useState('');
  const [approver, setApprover] = useState('');
  const [contributors, setContributors] = useState<IUser[]>([]);
  const [didSubmit, setDidSubmit] = useState(false);
  const [isCheckboxError, setIsCheckboxError] = useState(false);

  const { user } = useAuth();

  const getAuthor = useCallback(async (): Promise<void> => {
    if (isEmpty(pitch.author)) {
      return;
    }

    const res = await getUser(pitch.author);

    if (!isError(res)) {
      setAuthor(getUserFullName(res.data.result));
    }
  }, [pitch.author]);

  const getApprover = useCallback(async (): Promise<void> => {
    if (isEmpty(pitch.reviewedBy)) {
      return;
    }

    const res = await getUser(pitch.reviewedBy);

    if (!isError(res)) {
      setApprover(getUserFullName(res.data.result));
    }
  }, [pitch.reviewedBy]);

  const getContributors = useCallback(async (): Promise<void> => {
    const tempContributors: IUser[] = [];

    await Promise.all(
      pitch.assignmentContributors.map(async (id) => {
        const res = await getUser(id?.userId);

        if (!isError(res)) {
          tempContributors.push(res.data.result);
        }
      }),
    );
    setContributors([...tempContributors]);
  }, [pitch.assignmentContributors]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    getContributors();
    getApprover();
    getAuthor();

    setTeamSlots(pitch.teams);

    const map = new Map<string, boolean>();

    Object.keys(pitch.teams).map((team) => {
      map.set(team, false);
    });

    setCheckboxes(map);
  }, [isOpen, pitch.teams, getApprover, getAuthor, getContributors]);

  const updateCheckboxes = (checkbox: keyof IPitch['teams']): void => {
    const isChecked = checkboxes.get(checkbox);

    checkboxes.set(checkbox, !isChecked);

    setTeamSlots({ ...teamSlots });
    setCheckboxes(new Map(checkboxes));
  };

  const claimPitch = async (): Promise<void> => {
    setDidSubmit(true);

    if (!isValidForm()) {
      return;
    }
    const teams: string[] = [];
    checkboxes.forEach(function (selected, team) {
      if (selected) {
        teams.push(team);
      }
    });

    const userInfo = {
      userId: user._id,
      teams: teams,
    };

    const body = {
      teams: teamSlots,
      pendingContributors: [...pitch.pendingContributors, userInfo],
    };

    const pitchRes = await submitPitchClaim(pitch._id, user._id, teams);
    const updateRes = await updatePitch({ ...body }, pitch._id);
    if (!isError(pitchRes) && !isError(updateRes)) {
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

  const isUserOnTeam = (team: string): boolean =>
    user.currentTeams.includes(team.toUpperCase());
  const disableCheckbox = (team: string): boolean =>
    didUserClaim() || !isUserOnTeam(team);
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
            <h3>{`Submitted by: ${author}`}</h3>
          </div>
          <div className="author">
            <h3>{`Reviewed by: ${approver}`}</h3>
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
            {Object.entries(teamSlots).map((slot, index) => (
              <div className="checkbox-wrapper" key={index}>
                <Form.Checkbox
                  disabled={
                    slot[1].target - slot[1].current <= 0 ||
                    disableCheckbox(slot[0])
                  }
                  checked={checkboxes.get(slot[0])}
                  onClick={() => {
                    updateCheckboxes(slot[0] as keyof IPitch['teams']);
                    setDidSubmit(false);
                  }}
                  error={isCheckboxError}
                />
                <FieldTag content={slot[0]} />
                <h4>{slot[1].target - slot[1].current}</h4>
              </div>
            ))}
          </Form.Group>
        </Form>
        <h2>Pitch Claimed By</h2>
        <div className="contributors-section">
          {contributors.map((contributor, index) => (
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

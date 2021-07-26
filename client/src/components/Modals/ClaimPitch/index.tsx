import { isEmpty, startCase } from 'lodash';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Form, Image, Modal, ModalProps } from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';

import {
  getUser,
  isError,
  updatePitch,
  updatePitchContributors,
  updateUserClaimedPitches,
} from '../../../api';
import { useAuth } from '../../../contexts';
import { emptyPitch } from '../../../utils/constants';
import { convertToClassName } from '../../../utils/formatters';
import {
  convertMap,
  getUserFullName,
  getUserProfilePic,
} from '../../../utils/helpers';
import PitchCard from '../../PitchCard';

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
    if (isEmpty(pitch.pitchAuthor)) {
      return;
    }

    const res = await getUser(pitch.pitchAuthor);

    if (!isError(res)) {
      setAuthor(getUserFullName(res.data.result));
    }
  }, [pitch.pitchAuthor]);

  const getApprover = useCallback(async (): Promise<void> => {
    if (isEmpty(pitch.approvedBy)) {
      return;
    }

    const res = await getUser(pitch.approvedBy);

    if (!isError(res)) {
      setApprover(getUserFullName(res.data.result));
    }
  }, [pitch.approvedBy]);

  const getContributors = useCallback(async (): Promise<void> => {
    const tempContributors: IUser[] = [];

    await Promise.all(
      pitch.assignmentContributors.map(async (id) => {
        const res = await getUser(id);

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

    if (isChecked) {
      teamSlots[checkbox].current--;
    } else {
      teamSlots[checkbox].current++;
    }

    checkboxes.set(checkbox, !isChecked);

    setTeamSlots({ ...teamSlots });
    setCheckboxes(new Map(checkboxes));
  };

  const claimPitch = async (): Promise<void> => {
    setDidSubmit(true);

    if (!isValidForm()) {
      return;
    }

    const body = {
      teams: teamSlots,
      pendingContributors: [...pitch.pendingContributors, user._id],
    };

    const pitchRes = await updatePitchContributors(pitch._id, user._id);
    const claimedRes = await updateUserClaimedPitches(user._id, pitch._id);
    const updateRes = await updatePitch({ ...body }, pitch._id);
    if (!isError(pitchRes) && !isError(claimedRes) && !isError(updateRes)) {
      callback();
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
    pitch.assignmentContributors.includes(user._id) ||
    pitch.pendingContributors.includes(user._id);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<PitchCard pitch={pitch} />}
      className="claim-modal"
      {...rest}
    >
      <Modal.Header
        content={`${
          didUserClaim()
            ? 'You have already claimed this pitch!'
            : 'Claim Pitch'
        }`}
      />
      <Modal.Content>
        <h1>{pitch.name}</h1>
        <div className="author-section">
          <div className="author">
            <h3>{`Submitted by: ${author}`}</h3>
          </div>
          <div className="author">
            <h3>{`Reviewed by: ${approver}`}</h3>
          </div>
        </div>
        <p className="description">{pitch.pitchDescription}</p>
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
                    (slot[1].target - slot[1].current <= 0 &&
                      !checkboxes.get(slot[0])) ||
                    didUserClaim()
                  }
                  checked={checkboxes.get(slot[0])}
                  onClick={() => {
                    updateCheckboxes(slot[0] as keyof IPitch['teams']);
                    setDidSubmit(false);
                  }}
                  error={isCheckboxError}
                />
                <div className={`label ${convertToClassName(slot[0])}`}>
                  {startCase(slot[0])}
                </div>
                <h4>{slot[1].target - slot[1].current}</h4>
              </div>
            ))}
          </Form.Group>
        </Form>
        <h2>Pitch Claimed By</h2>
        <div className="contributors-section">
          {contributors.map((contributor, index) => (
            <Image
              circular
              title={getUserFullName(contributor)}
              size="tiny"
              key={index}
              src={getUserProfilePic(contributor)}
              alt={getUserFullName(contributor)}
            />
          ))}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          onClick={claimPitch}
          content="Submit pitch for review"
          positive
          disabled={didUserClaim()}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ClaimPitchModal;

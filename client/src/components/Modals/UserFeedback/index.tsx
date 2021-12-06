import React, { ReactElement, FC, useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalProps,
  Rating,
  TextArea,
  Icon,
} from 'semantic-ui-react';
import toast from 'react-hot-toast';
import { IUserFeedback, IUser, ITeam } from 'ssw-common';
import { toString } from 'lodash';

import { useAuth, useTeams } from '../../../contexts';
import { getAggregatedPitch, createUserFeedback, isError } from '../../../api';
import FieldTag from '../../FieldTag';
import UserChip from '../../UserChip';

import './styles.scss';

interface UserFeedbackModal extends ModalProps {
  contributor: IUser;
  pitchId: string;
}

const UserFeedbackModal: FC<UserFeedbackModal> = ({
  contributor,
  pitchId,
  trigger,
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [teams, setTeams] = useState<ITeam[]>([]);

  const { user } = useAuth();
  const { getTeamFromId } = useTeams();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    getContributorTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getContributorTeams = async (): Promise<void> => {
    const res = await getAggregatedPitch(pitchId);

    if (!isError(res)) {
      let { assignmentContributors } = res.data.result.aggregated;

      assignmentContributors = assignmentContributors.filter(
        (ele) => ele.user._id === contributor._id,
      );

      const contr = assignmentContributors[0];
      const tempTeams = contr.teams.map(getTeamFromId);
      setTeams(tempTeams as ITeam[]);
    }
  };

  const isEmpty = (): boolean =>
    rating === 0 || feedback === null || feedback.match(/^ *$/) !== null;

  const handleSubmit = async (): Promise<void> => {
    if (!isEmpty()) {
      const newFeedback: Partial<IUserFeedback> = {
        userId: contributor._id,
        staffId: user._id,
        pitchId: pitchId,
        stars: rating,
        reasoning: feedback,
      };
      const res = await createUserFeedback(newFeedback);
      if (!isError(res)) {
        toast.success('Successfully left feedback', {
          position: 'bottom-right',
        });
        setIsOpen(false);
      }
    } else {
      toast.error('Please fill out all fields', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <Modal
      className="feedback-modal"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={trigger}
    >
      <Modal.Header>
        Leave Feedback
        <div className="close-icon">
          <Icon name="close" onClick={() => setIsOpen(false)} />
        </div>
      </Modal.Header>
      <Modal.Content>
        <div className="line">
          <UserChip user={contributor} />

          {teams.map((team, index) => (
            <FieldTag
              name={team.name}
              hexcode={team.color}
              key={index}
              size="medium"
            />
          ))}
        </div>
        <div className="line">
          <Rating
            maxRating={5}
            size="large"
            value={rating}
            onRate={(e, { rating }) => {
              setRating(rating! as number);
            }}
            clearable
          />
        </div>
        <div className="line">
          <TextArea
            className="input-feedback"
            rows="10"
            onChange={(e, { value }) => setFeedback(toString(value))}
          ></TextArea>
        </div>
        <Modal.Actions>
          <Button type="submit" content="Submit" onClick={handleSubmit} />
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default UserFeedbackModal;

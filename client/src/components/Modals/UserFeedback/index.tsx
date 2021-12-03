import React, { ReactElement, FC, useState, useEffect } from 'react';
import { Button, Modal, ModalProps, Rating, TextArea } from 'semantic-ui-react';
import toast from 'react-hot-toast';
import { IUserFeedback, IUser, IPitchAggregate } from 'ssw-common';
import { toString } from 'lodash';
import { getAggregatedPitch } from '../../../api';

import { createUserFeedback, isError } from '../../../api';
import FieldTag from '../../FieldTag';
import UserChip from '../../UserChip';

import './styles.scss';
import { useAuth } from '../../../contexts';

interface UserFeedbackModal extends ModalProps {
  contributor: IUser;
  pitchId: string;
}

const UserFeedbackModal: FC<UserFeedbackModal> = ({
  contributor,
  pitchId,
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [teams, setTeams] = useState(['']);

  const { user } = useAuth();

  const getContributorTeams = async (): Promise<void> => {
    const res = await getAggregatedPitch(pitchId);

    if (!isError(res)) {
      let { assignmentContributors } = res.data.result.aggregated;
      assignmentContributors = assignmentContributors.filter(
        (ele) => ele.user._id === contributor._id,
      );
      assignmentContributors.forEach((ele) => setTeams(ele.teams));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const newFeedback: Partial<IUserFeedback> = {
      userId: contributor._id,
      staffId: user._id,
      pitchId: pitchId,
      stars: rating,
      reasoning: feedback,
    };
    const res = await createUserFeedback(newFeedback);
    if (!isError(res)) {
      toast.success('Success', { position: 'bottom-right' });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    getContributorTeams();
    console.log(teams);
  }, [isOpen]);

  return (
    <Modal
      className="feedback-modal"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      <Modal.Header>Leave Feedback</Modal.Header>
      <Modal.Content>
        <div className="line">
          <UserChip user={contributor} />
          {/* <FieldTag name={}/> */}
          {teams.map((team, index) => (
            <FieldTag name={team} key={index} />
          ))}
        </div>
        <div className="line">
          <Rating
            maxRating={5}
            size="large"
            value={rating}
            onRate={(e, { rating }) => {
              setRating(rating! as number);
              console.log(rating);
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

import React, { FC, ReactElement, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Icon,
  Label,
  Modal,
  ModalProps,
  Rating,
  TextArea,
} from 'semantic-ui-react';
import { ITeam, IUser, IUserFeedback } from 'ssw-common';
import { isError } from '../../../api';
import {
  addFeedback,
  getUserFeedbackForPitch,
} from '../../../api/userFeedback';

import FieldTag from '../../FieldTag';
import UserChip from '../../UserChip';
import './styles.scss';

interface FeedbackLabelProps extends ModalProps {
  userId: string;
  pitchId: string;
}

const FeedbackLabel: FC<FeedbackLabelProps> = ({
  userId,
  pitchId,
}): ReactElement => {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const feedback = getUserFeedbackForPitch(userId, pitchId);

    if (!feedback) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  }, []);
  return (
    <div>
      {checked && <Icon name="checkmark" />}
      <Label content="Leave Feedback" className="feedback-button" as="a" />
    </div>
  );
};

interface ClaimPitchProps extends ModalProps {
  user: Partial<IUser>;
  team: ITeam & { target: number };
  pitchId: string;
}

const ContributorFeedback: FC<ClaimPitchProps> = ({
  user,
  team,
  pitchId,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0 - 1);
  const [feedbackText, setFeedbackText] = useState('');

  const submitFeedback = async (): Promise<void> => {
    const newFeedback: Partial<IUserFeedback> = {
      stars: rating,
      reasoning: feedbackText,
      pitchId: pitchId,
      userId: user._id,
    };

    const res = await addFeedback(newFeedback);

    if (!isError(res)) {
      console.log(res);
    }
  };

  useEffect(() => {
    setRating(0 - 1);
    setFeedbackText('');
  }, [isOpen]);

  const saveDisabled = (): boolean => rating === 0 - 1 || !feedbackText;

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<FeedbackLabel userId={user._id!} pitchId={pitchId} />}
      className="contributor-feedback-modal"
      {...rest}
    >
      <Modal.Header>
        <div className="modal-header">
          Leave Feedback
          <Icon name="close" onClick={() => setIsOpen(false)} />
        </div>
      </Modal.Header>
      <Modal.Content scrolling>
        <div className="modal-content">
          <div className="user-team">
            <UserChip user={user} />
            <FieldTag name={team.name} hexcode={team.color} />
          </div>
          <Rating
            icon="star"
            defaultRating={0}
            maxRating={5}
            className="rating"
            size="huge"
            onRate={(_, { rating }) =>
              setRating(rating ? (rating as number) : 0 - 1)
            }
          />
          <Form>
            <TextArea
              style={{ minHeight: 150 }}
              onChange={(_, { value }) =>
                setFeedbackText(value ? (value as string) : '')
              }
            />
          </Form>
          <pre>
            {JSON.stringify({ rating: rating, text: feedbackText }, null, 2)}
          </pre>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          onClick={submitFeedback}
          content="Save"
          secondary
          disabled={saveDisabled()}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ContributorFeedback;

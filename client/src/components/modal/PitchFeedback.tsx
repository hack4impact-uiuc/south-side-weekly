import React, { ReactElement, FC, useState, useEffect } from 'react';
import { Modal, ModalProps, Icon, Menu, Label } from 'semantic-ui-react';
import { PitchFeedback } from 'ssw-common';

import { apiCall, isError } from '../../api';
import { useAuth } from '../../contexts';
import { PitchFeedbackForm } from '../form/PitchFeedbackForm';
import { PrimaryButton } from '../ui/PrimaryButton';
import { Pusher } from '../ui/Pusher';

import './modals.scss';

interface PitchFeedbackModal extends ModalProps {
  pitchId: string;
}

const defaultData: Partial<PitchFeedback> = {
  firstQuestion: '',
  secondQuestion: '',
  thirdQuestion: '',
  fourthQuestion: '',
};

const PitchFeedbackModal: FC<PitchFeedbackModal> = ({
  pitchId,
}): ReactElement => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<PitchFeedback | null>(null);

  useEffect(() => {
    const getFeedback = async (): Promise<void> => {
      const res = await apiCall<PitchFeedback>({
        url: `/pitchFeedback/${pitchId}/${user?._id}`,
        method: 'GET',
      });

      if (!isError(res)) {
        setFeedback(res.data.result);
      }
    };

    getFeedback();
  }, [isOpen, pitchId, user?._id]);

  const submitFeedback = async (
    pitchFeedback: Partial<PitchFeedback>,
  ): Promise<void> => {
    if (!feedback) {
      const res = await apiCall<PitchFeedback>({
        url: `/pitchFeedback`,
        method: 'POST',
        body: { ...pitchFeedback, pitchId: pitchId },
      });

      if (!isError(res)) {
        setIsOpen(false);
        setFeedback(res.data.result);
      }
    } else {
      const res = await apiCall<PitchFeedback>({
        url: `/pitchFeedback/${feedback._id}`,
        method: 'PUT',
        body: pitchFeedback,
      });

      if (!isError(res)) {
        setIsOpen(false);
        setFeedback(res.data.result);
      }
    }
  };

  return (
    <Modal
      className="pitch-feedback-modal"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={
        <div>
          <PrimaryButton content="Leave Feedback" />
          {feedback && (
            <Label className="feedback-label">
              Thank you for your feedback!{' '}
              <Icon name="check circle" color="green" />
            </Label>
          )}
        </div>
      }
    >
      <Modal.Header>
        <span>Leave Feedback</span>
        <Pusher />
        <Icon id="close-icon" name="close" onClick={() => setIsOpen(false)} />
      </Modal.Header>
      <Modal.Content scrolling>
        <p>Note this form is fully confidential and all fields are optional!</p>
        <PitchFeedbackForm
          initialValues={feedback || defaultData}
          id="pitch-feedback-form"
          onSubmit={submitFeedback}
        />
      </Modal.Content>
      <Modal.Actions>
        <PrimaryButton
          className="submit-btn"
          content="Submit Feedback"
          type="submit"
          form="pitch-feedback-form"
        />
      </Modal.Actions>
    </Modal>
  );
};

export default PitchFeedbackModal;

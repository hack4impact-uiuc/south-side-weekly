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
import { IPitchFeedback } from 'ssw-common';
import { toString } from 'lodash';
import QuestionsTab from './questionsTab';

import { useAuth, useTeams } from '../../../contexts';
import { getAggregatedPitch, isError } from '../../../api';
import { getPitchFeedback } from '../../../api';
import FieldTag from '../../FieldTag';
import UserChip from '../../UserChip';

import './styles.scss';

interface PitchFeedbackModal extends ModalProps {
  pitchId: string;
  trigger: ReactElement;
}

const PitchFeedbackModal: FC<PitchFeedbackModal> = ({
  pitchId,
  trigger,
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<IPitchFeedback[]>([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    getFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getFeedback = async (): Promise<void> => {
    const res = await getPitchFeedback(pitchId);

    if (!isError(res)) {
      setFeedbacks(res.data.result);
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
        View Contributor Feedback
        <Icon name="close" onClick={() => setIsOpen(false)} />
      </Modal.Header>
      <Modal.Content>
        <QuestionsTab feedbacks={feedbacks}/>
      </Modal.Content>
    </Modal>
  );
};

export default PitchFeedbackModal;

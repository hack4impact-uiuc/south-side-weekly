import React, { ReactElement, FC, useState, useEffect } from 'react';

import {
  Button,
  Modal,
  ModalProps,
  Rating,
  TextArea,
  Icon,
  Menu,
} from 'semantic-ui-react';
import toast from 'react-hot-toast';
import { IPitchFeedback } from 'ssw-common';
import { toString } from 'lodash';
import QuestionsTab from './questionsTab';
import IndividualTab from './individualTab';

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
  const TABS = {
    QUESTIONS: 'Questions',
    INDIVIDUAL: 'Individual',
  } as const; // As const prevents modification of this object
  type Tab = typeof TABS[keyof typeof TABS];
  const [isOpen, setIsOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<IPitchFeedback[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>(TABS.QUESTIONS);

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
      <Menu className="tab-menu" tabular secondary pointing size="large">
        <Menu.Item
          name={TABS.QUESTIONS}
          active={TABS.QUESTIONS === currentTab}
          onClick={() => setCurrentTab(TABS.QUESTIONS)}
        />
        <Menu.Item
          name={TABS.INDIVIDUAL}
          active={TABS.QUESTIONS === currentTab}
          onClick={() => setCurrentTab(TABS.INDIVIDUAL)}
        />
      </Menu>
      <Modal.Content>
        {currentTab === TABS.QUESTIONS ? (
          <QuestionsTab feedbacks={feedbacks} />
        ) : (
          <IndividualTab feedbacks={feedbacks} />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default PitchFeedbackModal;

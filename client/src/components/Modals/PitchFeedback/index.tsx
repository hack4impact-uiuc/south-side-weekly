import React, { ReactElement, FC, useState, useEffect } from 'react';
import { Modal, ModalProps, Icon, Menu } from 'semantic-ui-react';
import { PitchFeedback } from 'ssw-common';

import { apiCall, isError } from '../../../api';

import './styles.scss';

interface PitchFeedbackModal extends ModalProps {
  pitchId: string;
}

const PitchFeedbackModal: FC<PitchFeedbackModal> = ({
  pitchId,
  trigger,
}): ReactElement => {
  const TABS = {
    QUESTIONS: 'Questions',
    INDIVIDUAL: 'Individual',
  } as const;
  type Tab = typeof TABS[keyof typeof TABS];
  const [isOpen, setIsOpen] = useState(false);
  const [, setFeedbacks] = useState<PitchFeedback[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>(TABS.QUESTIONS);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const getFeedback = async (): Promise<void> => {
      const res = await apiCall<PitchFeedback[]>({
        url: `/pitchFeedback/${pitchId}`,
        method: 'GET',
      });

      if (!isError(res)) {
        setFeedbacks(res.data.result);
      }
    };

    getFeedback();
  }, [isOpen, pitchId]);

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
          active={TABS.INDIVIDUAL === currentTab}
          onClick={() => setCurrentTab(TABS.INDIVIDUAL)}
        />
      </Menu>
      <Modal.Content>
        {currentTab === TABS.QUESTIONS ? (
          // <QuestionsTab feedbacks={feedbacks} />
          <></>
        ) : (
          // <IndividualTab feedbacks={feedbacks} />
          <></>
        )}
      </Modal.Content>
    </Modal>
  );
};

export default PitchFeedbackModal;

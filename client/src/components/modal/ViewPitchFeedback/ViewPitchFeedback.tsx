import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Icon, Modal, ModalProps } from 'semantic-ui-react';
import { PitchFeedback } from 'ssw-common';

import { apiCall, isError } from '../../../api';
import { Tabs } from '../../../layouts/tabs/Tabs';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { Pusher } from '../../ui/Pusher';

import '../modals.scss';
import IndividualTab from './individualTab';
import QuestionsTab from './questionsTab';
import './ViewPitchFeedback.scss';

interface PitchFeedbackProps extends ModalProps {
  pitchId: string;
}

interface PitchFeedbacksResponse {
  data: PitchFeedback[];
  count: number;
}

export const ViewPitchFeedback: FC<PitchFeedbackProps> = ({
  pitchId,
  ...rest
}): ReactElement => {
  const TABS = {
    QUESTIONS: 'Questions',
    INDIVIDUAL: 'Individual',
  } as const;
  const [isOpen, setIsOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<PitchFeedbacksResponse>({
    data: [],
    count: 0,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const getFeedback = async (): Promise<void> => {
      const res = await apiCall<PitchFeedbacksResponse>({
        url: `/pitchFeedback/pitch/${pitchId}`,
        method: 'GET',
      });

      if (!isError(res)) {
        setFeedbacks(res.data.result);
      }
    };

    getFeedback();
  }, [isOpen, pitchId]);

  const views = useMemo(
    () => [
      {
        title: 'Questions',
        content: <QuestionsTab feedbacks={feedbacks.data} />,
      },
      {
        title: 'Individual',
        content: (
          <IndividualTab feedbacks={feedbacks.data} count={feedbacks.count} />
        ),
      },
    ],
    [feedbacks],
  );

  return (
    <Modal
      className="view-pitch-feedback-modal"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<PrimaryButton content="View Pitch Feedback" />}
      {...rest}
    >
      <Modal.Header>
        View Contributor Feedback
        <Pusher />
        <Icon name="close" onClick={() => setIsOpen(false)} />
      </Modal.Header>

      <Modal.Content scrolling>
        <Tabs views={views} />
      </Modal.Content>
    </Modal>
  );
};

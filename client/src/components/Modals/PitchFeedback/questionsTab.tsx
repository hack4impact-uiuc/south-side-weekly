import React, { ReactElement, FC, useState } from 'react';

import { ModalProps, Select } from 'semantic-ui-react';
import { IPitchFeedback } from 'ssw-common';
import { toString } from 'lodash';

import './styles.scss';

interface QuestionsTabProps extends ModalProps {
  feedbacks: IPitchFeedback[];
}

const QuestionsTab: FC<QuestionsTabProps> = ({ feedbacks }): ReactElement => {
  const [selectedQuestion, setSelectedQuestion] = useState('firstQuestion');
  const QuestionOptions = [
    {
      value: 'firstQuestion',
      text: 'Is there any way that the Weekly staff could have supported you better during the Weekly’s writing/editing process of the story?',
    },
    {
      value: 'secondQuestion',
      text: 'Can you share anything about your reporting/writing process that would be useful for other writers to know, or any lessons you learned from the process?',
    },
    {
      value: 'thirdQuestion',
      text: 'List any new contacts you made that could be useful for future Weekly writers to have (include name, organizational affiliation, contact info):',
    },
    { value: 'fourthQuestion', text: 'Any additional feedback? Thank you!' },
  ];

  const handleChange = (selected: string): void => {
    setSelectedQuestion(selected);
  };
  return (
    <div className="questions-tab">
      <Select
        className="questions-select"
        options={QuestionOptions}
        value={selectedQuestion}
        onChange={(e, data) => {
          handleChange(toString(data.value));
        }}
      />
      <h5>Contributor Responses</h5>
      {feedbacks.map(
        (feedback, index) =>
          feedback[selectedQuestion as keyof typeof feedback] !== null && (
            <dt className="block" key={index}>
              {feedback[selectedQuestion as keyof typeof feedback]}
            </dt>
          ),
      )}
    </div>
  );
};

export default QuestionsTab;

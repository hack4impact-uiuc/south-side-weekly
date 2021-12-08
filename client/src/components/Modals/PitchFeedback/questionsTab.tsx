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
    { value: 'firstQuestion', text: 'First Question' },
    { value: 'secondQuestion', text: 'Second Question' },
    { value: 'thirdQuestion', text: 'Third Question' },
  ];

  const handleChange = (selected: string): void => {
    setSelectedQuestion(selected);
  };
  return (
    <div className="questions-tab">
      <Select
        className="select"
        options={QuestionOptions}
        value={selectedQuestion}
        onChange={(e, data) => {
          handleChange(toString(data.value));
        }}
      />
      <h5>Contributor Responses</h5>
      {feedbacks.map((feedback, index) => (
        <dt className="block" key={index}>
          {feedback[selectedQuestion as keyof typeof feedback]}
        </dt>
      ))}
    </div>
  );
};

export default QuestionsTab;

import React, { ReactElement, FC, useState } from 'react';
import { ModalProps, Select } from 'semantic-ui-react';
import { IPitchFeedback } from 'ssw-common';
import { toString } from 'lodash';

import { pitchQuestionOptions } from '../../../utils/constants';

import './styles.scss';

interface QuestionsTabProps extends ModalProps {
  feedbacks: IPitchFeedback[];
}

const QuestionsTab: FC<QuestionsTabProps> = ({ feedbacks }): ReactElement => {
  const [selectedQuestion, setSelectedQuestion] = useState('firstQuestion');

  const handleChange = (selected: string): void => {
    setSelectedQuestion(selected);
  };
  return (
    <div className="questions-tab">
      <Select
        className="questions-select"
        options={pitchQuestionOptions}
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

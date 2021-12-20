import React, { ReactElement, FC, useState, useEffect } from 'react';
import { ModalProps, Icon, Select } from 'semantic-ui-react';
import { IPitchFeedback } from 'ssw-common';
import { toNumber } from 'lodash';

import './styles.scss';

interface QuestionsTabProps extends ModalProps {
  feedbacks: IPitchFeedback[];
}

const IndividualTab: FC<QuestionsTabProps> = ({ feedbacks }): ReactElement => {
  const [feedback, setFeedback] = useState<IPitchFeedback>(feedbacks[0]);
  const [index, setIndex] = useState(0);
  const totalNumFeedback = feedbacks.length;

  useEffect(() => {
    setFeedback(feedbacks[index]);
  }, [feedbacks, index]);

  const handleRightClick = (): void => {
    index !== totalNumFeedback - 1 && setIndex(index + 1);
  };

  const handlLeftClick = (): void => {
    index !== 0 && setIndex(index - 1);
  };
  return (
    <div>
      <div className="left-right-control">
        <Icon name="angle left" size="large" onClick={handlLeftClick} />
        <Select
          className="individual-select"
          options={feedbacks.map((item, idx) => ({
            text: idx + 1,
            value: idx,
          }))}
          value={index}
          onChange={(e, data) => {
            setIndex(toNumber(data.value));
          }}
        />
        of {totalNumFeedback}
        <Icon name="angle right" size="large" onClick={handleRightClick} />
      </div>
      <dt>
        Is there any way that the Weekly staff could have supported you better
        during the Weekly’s writing/editing process of the story?
      </dt>
      <dt className="block">{feedback.firstQuestion}</dt>
      <dt>
        Can you share anything about your reporting/writing process that would
        be useful for other writers to know, or any lessons you learned from the
        process?
      </dt>
      <dt className="block">{feedback.secondQuestion}</dt>
      <dt>
        List any new contacts you made that could be useful for future Weekly
        writers to have (include ƒname, organizational affiliation, contact
        info):
      </dt>
      <dt className="block">{feedback.thirdQuestion}</dt>
      <dt>Any additional feedback? Thank you!</dt>
      <dt className="block">{feedback.fourthQuestion}</dt>
    </div>
  );
};

export default IndividualTab;

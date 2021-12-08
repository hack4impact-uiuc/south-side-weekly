import React, { ReactElement, FC, useState, useEffect } from 'react';

import {
  Button,
  Modal,
  ModalProps,
  Rating,
  TextArea,
  Icon,
  Pagination,
  Select,
} from 'semantic-ui-react';
import toast from 'react-hot-toast';
import { IPitchFeedback } from 'ssw-common';
import { toNumber, toString } from 'lodash';

import { useAuth, useTeams } from '../../../contexts';
import { getAggregatedPitch, isError } from '../../../api';
import { getPitchFeedback } from '../../../api';
import FieldTag from '../../FieldTag';
import UserChip from '../../UserChip';

import './styles.scss';

interface QuestionsTabProps extends ModalProps {
  feedbacks: IPitchFeedback[];
}

const IndividualTab: FC<QuestionsTabProps> = ({ feedbacks }): ReactElement => {
  const [feedback, setFeedback] = useState<IPitchFeedback>(feedbacks[0]);
  return (
    <div>
      <Icon name="angle left" />
      <Select
      className="individual-select"
        options={feedbacks.map((item, index) => ({
          text: index + 1,
          value: index,
        }))}
        onChange={(e, data) => {
          setFeedback(feedbacks[toNumber(data.value)]);
        }}
      />
      of {feedbacks.length}
      <Icon name="angle right" />
      <h5>
        Is there any way that the Weekly staff could have supported you better
        during the Weekly’s writing/editing process of the story?
      </h5>
      <dt>{feedback.firstQuestion}</dt>
      <h5>
        Can you share anything about your reporting/writing process that would
        be useful for other writers to know, or any lessons you learned from the
        process?
      </h5>
      <dt>{feedback.secondQuestion}</dt>
      <h5>
        List any new contacts you made that could be useful for future Weekly
        writers to have (include name, organizational affiliation, contact
        info):
      </h5>
      <dt>{feedback.thirdQuestion}</dt>
      <h5>Any additional feedback? Thank you!</h5>
      {/* <dt>{feedback.fourthQuestion}</dt> */}
    </div>
  );
};

export default IndividualTab;

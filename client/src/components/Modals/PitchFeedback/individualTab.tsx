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

import { useAuth, useTeams } from '../../../contexts';
import { getAggregatedPitch, isError } from '../../../api';
import { getPitchFeedback } from '../../../api';
import FieldTag from '../../FieldTag';
import UserChip from '../../UserChip';

import './styles.scss';

interface QuestionsTabProps extends ModalProps {
  feedbacks: IPitchFeedback[];
}

const IndividualTab: FC<QuestionsTabProps> = ({ feedbacks }): ReactElement => (
  <div>
    {feedbacks.map((feedback, index) => (
      <dt key={index}>{feedback.secondQuestion}</dt>
    ))}
  </div>
);

export default IndividualTab;

import { buildSchema } from './utils';

export const pitchFeedbackBody = {
  userId: {
    type: 'string',
    description:
      'The id of the user who submitted the feedback. This is not returned ever from the API as to preserver the anonymous nature of the feedback.',
  },
  pitchId: {
    type: 'string',
    description: 'The id of the pitch that the feedback is for.',
  },
  firstQuestion: {
    type: 'string',
    description: 'The first question of the feedback.',
  },
  secondQuestion: {
    type: 'string',
    description: 'The second question of the feedback.',
  },
  thirdQuestion: {
    type: 'string',
    description: 'The third question of the feedback.',
  },
  fourthQuestion: {
    type: 'string',
    description: 'The fourth question of the feedback.',
  },
  createdAt: {
    type: 'string',
    description: 'The date that the pitch feedback was created.',
  },
  updatedAt: {
    type: 'string',
    description: 'The date that the pitch feedback was last updated.',
  },
};

export const pitchFeedbackSchema = buildSchema(pitchFeedbackBody, [
  'userId',
  'pitchId',
]);

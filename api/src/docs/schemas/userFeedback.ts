import { buildSchema } from './utils';

export const userFeedbackBody = {
  userId: {
    type: 'string',
    description: 'The id of the user who submitted the feedback.',
  },
  pitchId: {
    type: 'string',
    description: 'The id of the pitch that the feedback is for.',
  },
  staffId: {
    type: 'string',
    description: 'The id of the staff member who submitted the feedback.',
  },
  stars: {
    type: 'number',
    description: 'The number of stars given to the pitch.',
  },
  reasoning: {
    type: 'string',
    description: 'The reasoning foro the feedback given by the staff.',
  },
  createdAt: {
    type: 'string',
    description: 'The date that the user feedback was created.',
  },
  updatedAt: {
    type: 'string',
    description: 'The date that the user feedback was last updated.',
  },
};

export const userFeedbackSchema = buildSchema(userFeedbackBody, [
  'userId',
  'pitchId',
  'staffId',
]);

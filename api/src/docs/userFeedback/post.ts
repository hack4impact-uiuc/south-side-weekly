import { userFeedbackBody } from '../schemas/userFeedback';
import { buildPath } from '../utils';

export const createUserFeedback = buildPath({
  method: 'POST',
  model: 'UserFeedback',
  opId: 'createUserFeedback',
  description: 'Creates a user feedback with data in the body.',
  body: {
    description: 'The data to create the user feedback with.',
    schema: {
      type: 'object',
      properties: {
        ...userFeedbackBody,
      },
    },
  },
});

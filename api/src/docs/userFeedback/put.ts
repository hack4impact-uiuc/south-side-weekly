import { buildPath } from '../utils';
import { userFeedbackBody } from '../schemas/userFeedback';

export const updateUserFeedback = buildPath({
  method: 'PUT',
  model: 'UserFeedback',
  opId: 'updateUserFeedback',
  description: 'Updates a user feedback with data in the body',
  params: [{ name: 'id', description: 'The id of the user feedback' }],
  body: {
    description: 'The data to update the user feedback with',
    schema: {
      type: 'object',
      properties: {
        ...userFeedbackBody,
      },
    },
  },
});

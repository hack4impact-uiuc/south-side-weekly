import { userBody } from '../schemas/user';
import { buildPath } from '../utils';

export const createUser = buildPath({
  method: 'POST',
  model: 'User',
  opId: 'createUser',
  description: 'Creates a user with data in the body',
  body: {
    description: 'The data to create the user with',
    schema: {
      type: 'object',
      properties: {
        ...userBody,
      },
    },
  },
});

import { buildPath, extractRefPath } from '../utils';

export const createUser = buildPath(
  'POST',
  'User',
  'createUser',
  'Creates a new user.',
  [],
  {
    description: 'The data to create the user with.',
    schema: { $ref: extractRefPath('User') },
  },
);

export const createUser2 = {
  post: {
    tags: ['Users'],
    description:
      'Creates a new user in the database. This will likely not be used because passport handles user creation through oauth ID. ',
    operationId: 'createUser',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'User id',
        required: true,
      },
    ],
    body: {
      description: 'User object',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/User',
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'User was created.',
        content: {
          'application/json': {
            $ref: '#/components/schemas/User',
          },
        },
      },
      '400': {
        description:
          'User was not created. Information to create a user is missing.',
      },
    },
  },
};

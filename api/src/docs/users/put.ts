import { userBody } from '../schemas/user';
import { buildPath } from '../utils';

export const updateUser = buildPath({
  method: 'PUT',
  model: 'User',
  opId: 'updateUser',
  description: 'Updates a user by id',
  params: [
    {
      name: 'id',
      description: 'The id of the user to update',
    },
  ],
  body: {
    description: 'The data to update the user with',
    schema: {
      type: 'object',
      properties: {
        ...userBody,
      },
    },
  },
});

export const approveUser = buildPath({
  method: 'PUT',
  model: 'User',
  opId: 'approveUser',
  description: 'Approves a user by id',
  params: [
    {
      name: 'id',
      description: 'The id of the user to approve',
    },
  ],
});

export const denyUser = buildPath({
  method: 'PUT',
  model: 'User',
  opId: 'denyUser',
  description: 'Denies a user by id',
  params: [
    {
      name: 'id',
      description: 'The id of the user to deny',
    },
  ],
});

export const claimPitch = buildPath({
  method: 'PUT',
  model: 'User',
  opId: 'claimPitch',
  description: 'Claims a pitch by id',
  params: [
    {
      name: 'id',
      description: 'The id of the user that is claiming.',
    },
  ],
  body: {
    description: 'The data to claim the pitch with',
    schema: {
      type: 'object',
      properties: {
        pitchId: {
          type: 'string',
          description: 'The id of the pitch to claim.',
        },
      },
    },
  },
});

export const stallUsers = buildPath({
  method: 'PUT',
  model: 'User',
  opId: 'stallUsers',
  description: 'Stalls users by id',
  ignoreRespones: ['404', '400'],
});

export const visitPage = buildPath({
  method: 'PUT',
  model: 'User',
  opId: 'visitPage',
  description: 'Visits a page by id',
  params: [
    {
      name: 'id',
      description: 'The id of the user that is visiting.',
    },
  ],
  body: {
    description: 'The data to visit the page with',
    schema: {
      type: 'object',
      properties: {
        pageId: {
          type: 'string',
          description: 'The name of the page to visit.',
        },
      },
    },
  },
});

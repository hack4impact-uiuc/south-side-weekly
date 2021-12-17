import { buildPath, extractRefPath } from '../utils';

export const updateUser = buildPath(
  'PUT',
  'User',
  'updateUser',
  'Updates a user with the passed data.',
  [],
  {
    description: 'The data to update the user with.',
    schema: {
      $ref: extractRefPath('User'),
    },
  },
);

export const approveUser = buildPath(
  'PUT',
  'User',
  'approveUser',
  'Approves a user. This allows the user to access the dashboard.',
  [{ name: 'id', description: 'The user id to approve.' }],
);

export const denyUser = buildPath(
  'PUT',
  'User',
  'denyUser',
  'Denies a user. This prohibts a user from using the dashboard.',
  [{ name: 'id', description: 'The user id to deny.' }],
);

export const claimPitch = buildPath(
  'PUT',
  'User',
  'claimPitch',
  'Claims a pitch for a user. A user is now a contributor on the pitch.',
  [{ name: 'id', description: 'The user id that is going to claim a pitch.' }],
  {
    description: 'The pitch id to claim.',
    schema: {
      type: 'object',
      properties: {
        pitchId: {
          type: 'string',
        },
      },
    },
  },
);

export const stallUsers = buildPath(
  'PUT',
  'User',
  'stallUser',
  'Stalls of the users in the database that have had an onboarding status of pending or onboarding scheduled for the last two weeks.',
  [],
  {},
  ['404'],
);

export const visitPage = buildPath(
  'PUT',
  'User',
  'visitPage',
  'Visits a page for a user. This is used to track which pages the user has viewed on the dashboard',
  [{ name: 'id', description: 'The user id that is going to visit a page.' }],
  {
    description: 'The page to visit.',
    schema: {
      type: 'object',
      properties: {
        page: {
          type: 'string',
        },
      },
    },
  },
);

console.log(visitPage);

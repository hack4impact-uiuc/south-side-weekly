import { buildPath } from '../utils';

export const getUsers = buildPath(
  'GET',
  'User',
  'getUser',
  'Gets all of the users from the database.',
);

export const getApprovedUsers = buildPath(
  'GET',
  'User',
  'getApproved',
  'Gets all of the approved users from the database.',
);

export const getDeniedUsers = buildPath(
  'GET',
  'User',
  'getDenied',
  'Gets all of the denied users from the database.',
);

export const getPendingUsers = buildPath(
  'GET',
  'User',
  'getPending',
  'Gets all of the pending users from the database.',
);

export const getUserById = buildPath(
  'GET',
  'User',
  'getUserId',
  'Gets a user by id.',
  [{ name: 'id', description: 'The user id to retrieve.' }],
);

export const getUserPermissions = buildPath(
  'GET',
  'User',
  'getUserPermissions',
  "Gets the current user's permissions. Must be logged in.",
);

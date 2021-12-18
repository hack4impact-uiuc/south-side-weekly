import { buildPath } from '../utils';

export const getUsers = buildPath({
  method: 'GET',
  model: 'User',
  opId: 'getUsers',
  description: 'Gets all users',
});

export const getApprovedUsers = buildPath({
  method: 'GET',
  model: 'User',
  opId: 'getApprovedUsers',
  description: 'Gets all approved users',
});

export const getDeniedUsers = buildPath({
  method: 'GET',
  model: 'User',
  opId: 'getDeniedUsers',
  description: 'Gets all denied users',
});

export const getPendingUsers = buildPath({
  method: 'GET',
  model: 'User',
  opId: 'getPendingUsers',
  description: 'Gets all pending users',
});

export const getUserById = buildPath({
  method: 'GET',
  model: 'User',
  opId: 'getUserById',
  description: 'Gets a user by id',
  params: [
    {
      name: 'id',
      description: 'The id of the user to get',
    },
  ],
});

export const getUserPermissions = buildPath({
  method: 'GET',
  model: 'User',
  opId: 'getUserPermissions',
  description: "Gets the current user's permissions",
});

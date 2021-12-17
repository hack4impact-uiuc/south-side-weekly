import { buildPath } from '../utils';

export const deleteUser = buildPath(
  'DELETE',
  'User',
  'deleteUser',
  'Deletes a user.',
  [{ name: 'id', description: 'The user id to delete.' }],
);

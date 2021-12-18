import { buildPath } from '../utils';

export const deleteUser = buildPath({
  method: 'DELETE',
  model: 'User',
  opId: 'deleteUser',
  description: 'Deletes a user by id',
  params: [
    {
      name: 'id',
      description: 'The id of the user to delete',
    },
  ],
});

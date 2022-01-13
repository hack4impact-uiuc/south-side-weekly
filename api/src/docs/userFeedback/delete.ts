import { buildPath } from '../utils';

export const deleteUserFeedback = buildPath({
  method: 'DELETE',
  model: 'UserFeedback',
  opId: 'deleteUserFeedback',
  description: 'Deletes a user feedback.',
  params: [{ name: 'id', description: 'The id of the user feedback.' }],
});

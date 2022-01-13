import { buildPath } from '../utils';

export const deleteIssue = buildPath({
  method: 'DELETE',
  model: 'Issue',
  opId: 'deleteIssue',
  description: 'Deletes a issue.',
  params: [{ name: 'id', description: 'The id of the issue.' }],
});

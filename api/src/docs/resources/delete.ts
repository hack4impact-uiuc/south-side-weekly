import { buildPath } from '../utils';

export const deleteResource = buildPath({
  method: 'DELETE',
  model: 'Resource',
  opId: 'deleteResource',
  description: 'Deletes a resource.',
  params: [{ name: 'id', description: 'The id of the resource.' }],
});

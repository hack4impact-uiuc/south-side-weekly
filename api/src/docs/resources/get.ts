import { buildPath } from '../utils';

export const getResources = buildPath({
  method: 'GET',
  model: 'Resource',
  opId: 'getResources',
  description: 'Gets all resources',
});

export const getResourceById = buildPath({
  method: 'GET',
  model: 'Resource',
  opId: 'getResourceById',
  description: 'Gets a resource by id',
  params: [{ name: 'id', description: 'The id of the resource' }],
});

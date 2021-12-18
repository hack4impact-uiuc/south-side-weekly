import { buildPath } from '../utils';
import { resourceBody } from '../schemas/resource';

export const updateResource = buildPath({
  method: 'PUT',
  model: 'Resource',
  opId: 'updateResource',
  description: 'Updates a resource with data in the body',
  params: [{ name: 'id', description: 'The id of the resource' }],
  body: {
    description: 'The data to update the resource with',
    schema: {
      type: 'object',
      properties: {
        ...resourceBody,
      },
    },
  },
});

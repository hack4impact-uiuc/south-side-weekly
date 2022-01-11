import { buildPath } from '../utils';
import { resourceBody } from '../schemas/resource';

export const createResource = buildPath({
  method: 'POST',
  model: 'Resource',
  opId: 'createResource',
  description: 'Creates a resource with data in the body.',
  body: {
    description: 'The data to create the resource with.',
    schema: {
      type: 'object',
      properties: {
        ...resourceBody,
      },
    },
  },
});

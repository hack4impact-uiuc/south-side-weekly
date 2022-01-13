import { buildPath } from '../utils';
import { pitchBody } from '../schemas/pitch';

export const createPitch = buildPath({
  method: 'POST',
  model: 'Pitch',
  opId: 'createPitch',
  description: 'Creates a pitch with data in the body.',
  body: {
    description: 'The data to create the pitch with.',
    schema: {
      type: 'object',
      properties: {
        ...pitchBody,
      },
    },
  },
});

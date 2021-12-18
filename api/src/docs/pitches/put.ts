import { buildPath } from '../utils';
import { pitchBody } from '../schemas/pitch';

export const updatePitch = buildPath({
  method: 'PUT',
  model: 'Pitch',
  opId: 'updatePitch',
  description: 'Updates a pitch with data in the body',
  params: [{ name: 'id', description: 'The id of the pitch' }],
  body: {
    description: 'The data to update the pitch with',
    schema: {
      type: 'object',
      properties: {
        ...pitchBody,
      },
    },
  },
});

export const approvePitch = buildPath({
  method: 'PUT',
  model: 'Pitch',
  opId: 'approvePitch',
  description: 'Approves a pitch',
  params: [{ name: 'id', description: 'The id of the pitch' }],
});

export const declinePitch = buildPath({
  method: 'PUT',
  model: 'Pitch',
  opId: 'declinePitch',
  description: 'Declines a pitch',
  params: [{ name: 'id', description: 'The id of the pitch' }],
});

export const submitClaim = buildPath({
  method: 'PUT',
  model: 'Pitch',
  opId: 'submitClaim',
  description: 'Submits a claim for a pitch',
  params: [{ name: 'id', description: 'The id of the pitch' }],
});

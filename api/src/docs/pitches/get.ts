import { buildPath } from '../utils';

export const getPitches = buildPath({
  method: 'GET',
  model: 'Pitch',
  opId: 'getPitches',
  description: 'Gets all pitches',
});

export const getPitchById = buildPath({
  method: 'GET',
  model: 'Pitch',
  opId: 'getPitchById',
  description: 'Gets a pitch by id',
  params: [{ name: 'id', description: 'The id of the pitch' }],
});

export const getApprovedPitches = buildPath({
  method: 'GET',
  model: 'Pitch',
  opId: 'getApprovedPitches',
  description: 'Gets all approved pitches',
});

export const getPendingPitches = buildPath({
  method: 'GET',
  model: 'Pitch',
  opId: 'getPendingPitches',
  description: 'Gets all pending pitches',
});

export const getPitchesWithPendingClaims = buildPath({
  method: 'GET',
  model: 'Pitch',
  opId: 'getPitchesWithPendingClaims',
  description: 'Gets all pitches with pending claims.',
});

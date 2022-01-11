import { buildPath } from '../utils';

export const deletePitch = buildPath({
  method: 'DELETE',
  model: 'Pitch',
  opId: 'deletePitch',
  description: 'Deletes a pitch.',
  params: [{ name: 'id', description: 'The id of the pitch.' }],
});

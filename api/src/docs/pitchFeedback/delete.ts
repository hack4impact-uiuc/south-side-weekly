import { buildPath } from '../utils';

export const deletePitchFeedback = buildPath({
  method: 'DELETE',
  model: 'PitchFeedback',
  opId: 'deletePitchFeedback',
  description: 'Deletes a pitch feedback',
  params: [{ name: 'id', description: 'The id of the pitch feedback' }],
});

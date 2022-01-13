import { buildPath } from '../utils';

export const getPitchFeedbacks = buildPath({
  method: 'GET',
  model: 'PitchFeedback',
  opId: 'getPitchFeedbacks',
  description: 'Gets all pitch feedbacks',
});

export const getPitchFeedbackById = buildPath({
  method: 'GET',
  model: 'PitchFeedback',
  opId: 'getPitchFeedbackById',
  description: 'Gets a pitch feedback by id',
  params: [{ name: 'id', description: 'The id of the pitch feedback' }],
});

export const getFeedbackForPitch = buildPath({
  method: 'GET',
  model: 'PitchFeedback',
  opId: 'getFeedbackForPitch',
  description: 'Gets all pitch feedbacks for a pitch',
  params: [{ name: 'id', description: 'The id of the pitch' }],
});

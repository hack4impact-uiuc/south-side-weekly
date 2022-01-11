import { buildPath } from '../utils';

export const getUserFeedbacks = buildPath({
  method: 'GET',
  model: 'UserFeedback',
  opId: 'getUserFeedbacks',
  description: 'Gets all user feedbacks',
});

export const getUserFeedbackById = buildPath({
  method: 'GET',
  model: 'UserFeedback',
  opId: 'getUserFeedbackById',
  description: 'Gets a user feedback by id',
  params: [{ name: 'id', description: 'The id of the user feedback' }],
});

export const getFeedbackForUser = buildPath({
  method: 'GET',
  model: 'UserFeedback',
  opId: 'getFeedbackForUser',
  description: 'Gets all user feedbacks for a user',
  params: [{ name: 'id', description: 'The id of the user' }],
});

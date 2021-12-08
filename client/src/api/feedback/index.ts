import { Response } from '../types';
import { buildEndpoint, get } from '../builders';

import { UserFeedbackResponse } from './types';

const FEEDBACK_ENDPOINT = '/userFeedback';

const getUserFeedback = async (
  userId: string,
): Promise<Response<UserFeedbackResponse>> => {
  const url = buildEndpoint(FEEDBACK_ENDPOINT, 'user', userId);
  const failureMessage = 'GET_FEEDBACK_FAIL';

  return await get(url, failureMessage);
};

export { getUserFeedback };

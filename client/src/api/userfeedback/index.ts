import { IUserFeedback } from 'ssw-common';

import { get, buildEndpoint, post, put } from '../builders';
import { ApiResponseBase, Response } from '../types';

const USER_FEEDBACK_ENDPOINT = '/userFeedback';

const createUserFeedback = async (
  userFeedback: Partial<IUserFeedback>,
): Promise<Response<ApiResponseBase>> => {
  const url = buildEndpoint(USER_FEEDBACK_ENDPOINT, '');

  const failureMessage = 'CREATES_NEW_USER_FEEDBACK_FAIL';

  return await post(url, { ...userFeedback }, failureMessage);
};

export {createUserFeedback};
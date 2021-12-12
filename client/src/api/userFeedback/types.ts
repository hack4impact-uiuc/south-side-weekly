import { IUserFeedback } from 'ssw-common';

import { ApiResponseBase } from '../types';
export interface UsersFeedbackResponse extends ApiResponseBase {
  result: IUserFeedback[];
}

export interface UserFeedbackResponse extends ApiResponseBase {
  result: IUserFeedback;
}

import { IUserFeedback } from 'ssw-common';

import { ApiResponseBase } from '../types';

export interface UserFeedbackResponse extends ApiResponseBase {
  result: IUserFeedback[];
}

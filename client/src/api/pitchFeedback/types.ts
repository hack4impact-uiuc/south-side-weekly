import { IPitchFeedback } from 'ssw-common';

import { ApiResponseBase } from '../types';

export interface PitchFeedbackResponse extends ApiResponseBase {
  result: IPitchFeedback[];
}

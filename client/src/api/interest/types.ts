import { IInterest } from 'ssw-common';

import { ApiResponseBase } from '../types';

export interface InterestsResponse extends ApiResponseBase {
  result: IInterest[];
}

export interface InterestResponse extends ApiResponseBase {
  result: IInterest;
}

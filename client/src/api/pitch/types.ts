import { IPitch } from 'ssw-common';

import { ApiResponseBase } from '../types';

export interface PitchesResponse extends ApiResponseBase {
  result: IPitch[];
}

export interface GetOpenTeamsResponse extends ApiResponseBase {
  result: IPitch['teams'];
}

export interface PitchResponse extends ApiResponseBase {
  result: IPitch;
}

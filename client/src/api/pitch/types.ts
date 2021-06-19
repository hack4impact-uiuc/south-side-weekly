import { IPitch } from 'ssw-common';

import { ApiResponseBase } from '../types';

export interface GetPitchesResponseType extends ApiResponseBase {
  result: IPitch[];
}

export interface GetOpenTeamsResponseType extends ApiResponseBase {
  result: IPitch['teams'];
}

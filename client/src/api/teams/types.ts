import { ITeam } from 'ssw-common';

import { ApiResponseBase } from '../types';

export interface TeamsResponse extends ApiResponseBase {
  result: ITeam[];
}

export interface TeamResponse extends ApiResponseBase {
  result: ITeam;
}

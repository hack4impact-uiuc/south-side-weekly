import { IUser } from 'ssw-common';

import { ApiResponseBase } from '../types';

export interface GetCurrentUserResponseType extends ApiResponseBase {
  result: IUser;
}

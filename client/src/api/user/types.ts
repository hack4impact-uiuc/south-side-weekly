import { IUser, IPitch } from 'ssw-common';
import { ApiResponseBase } from '../types';
export interface GetUsersResponseType extends ApiResponseBase {
  result: IUser[];
}

export interface GetCurrentUserResponseType extends ApiResponseBase {
  result: IUser;
}

export interface GetUserPitchesResponseType extends ApiResponseBase {
  result: IPitch[];
}

export interface GetUserResponseType extends ApiResponseBase {
  result: IUser;
}

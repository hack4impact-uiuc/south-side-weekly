import { IUser, IUserAggregate } from 'ssw-common';

import { ApiResponseBase } from '../types';
export interface UsersResponse extends ApiResponseBase {
  result: IUser[];
}

export interface UserResponse extends ApiResponseBase {
  result: IUser;
}
export interface UserPermissions extends ApiResponseBase {
  result: {
    view: (keyof IUser)[];
    edit: (keyof IUser)[];
  };
}

export interface AggregatedUserResponse extends ApiResponseBase {
  result: IUserAggregate;
}

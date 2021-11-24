import { IInterest, IPitch, IUser, IUserAggregate } from 'ssw-common';

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
export interface AggregateUserResponse extends ApiResponseBase {
  result: IUserAggregate;
}

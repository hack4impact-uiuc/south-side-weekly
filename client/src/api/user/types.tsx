import { IUser } from 'ssw-common';

export interface GetUsersResponseType {
  message: string;
  result: IUser[];
}

import { AxiosResponse } from 'axios';

import { ErrorWrapper } from '../types';
import { get } from '../builders';

import { GetUsersResponseType } from './types';

const USER_ENDPOINT = '/users/';

const getUsers = async (): Promise<
  AxiosResponse<GetUsersResponseType> | ErrorWrapper
> => await get(USER_ENDPOINT, 'GET_USERS_FAIL');

export { getUsers };

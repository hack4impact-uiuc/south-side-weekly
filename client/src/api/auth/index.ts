import { AxiosResponse } from 'axios';

import { ErrorWrapper } from '../types';
import { get } from '../builders';

import * as Types from './types';

const AUTH_ENDPOINT = '/auth';

// Returns the logged in user
const getCurrentUser = async (): Promise<
  AxiosResponse<Types.GetCurrentUserResponseType> | ErrorWrapper
> => await get(`${AUTH_ENDPOINT}/currentUser`, 'GET_CURRENT_USER_FAIL');

export { getCurrentUser };

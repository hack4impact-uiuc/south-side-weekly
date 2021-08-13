import { Response } from '../types';
import { get } from '../builders';
import { UserResponse } from '../user/types';

const AUTH_ENDPOINT = '/auth';

// Returns the logged in user
const getCurrentUser = async (): Promise<Response<UserResponse>> =>
  await get(`${AUTH_ENDPOINT}/currentUser`, 'GET_CURRENT_USER_FAIL');

const logout = async (): Promise<Response<void>> =>
  await get(`${AUTH_ENDPOINT}/logout`, 'LOGOUT_FAILURE');

export { getCurrentUser, logout };

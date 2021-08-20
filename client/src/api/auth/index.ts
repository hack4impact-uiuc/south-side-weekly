import { Response } from '../types';
import { buildEndpoint, get } from '../builders';
import { UserResponse } from '../user/types';

const AUTH_ENDPOINT = '/auth';

// Returns the logged in user
const getCurrentUser = async (): Promise<Response<UserResponse>> => {
  const url = buildEndpoint(AUTH_ENDPOINT, 'currentUser');
  const failureMessage = 'GET_CURRENT_USER_FAIL';

  return await get(url, failureMessage);
};

const logout = async (): Promise<Response<void>> => {
  const url = buildEndpoint(AUTH_ENDPOINT, 'logout');
  const failureMessage = 'LOGOUT_FAILURE';

  return await get(url, failureMessage);
};

export { getCurrentUser, logout };

import { AxiosResponse } from 'axios';

import { ErrorWrapper } from '../types';
import { get, put } from '../builders';

import * as Types from './types';

const USER_ENDPOINT = '/users';

// Returns all of the users in the database
const getUsers = async (): Promise<
  AxiosResponse<Types.GetUsersResponseType> | ErrorWrapper
> => await get(USER_ENDPOINT, 'GET_USERS_FAIL');

// Returns the logged in user
const getCurrentUser = async (): Promise<
  AxiosResponse<Types.GetCurrentUserResponseType> | ErrorWrapper
> => await get('/auth/currentUser', 'GET_CURRENT_USER_FAIL');

// Returns a single user from the user's id
const getUser = async (
  userId: string,
): Promise<AxiosResponse<Types.GetUserResponseType> | ErrorWrapper> =>
  await get(`${USER_ENDPOINT}/${userId}`, 'GET_USER_FAIL');

// Adds a pitch to a user's claimed pitches
const claimPitch = async (
  userId: string,
  pitchId: string,
): Promise<AxiosResponse<Types.GetUserPitchesResponseType> | ErrorWrapper> =>
  await put(
    `${USER_ENDPOINT}/${userId}/pitches`,
    pitchId,
    'UPDATE_USER_PITCHES_FAIL',
  );

// Update a user's data
const updateUser = async (
  profileData: {
    [key: string]: string | boolean | string[] | Date | null;
  },
  userId: string,
): Promise<AxiosResponse<Types.GetUserResponseType> | ErrorWrapper> =>
  await put(`${USER_ENDPOINT}/${userId}`, profileData, 'UPDATE_USER_FAIL');

export { getUsers, getCurrentUser, getUser, claimPitch, updateUser };

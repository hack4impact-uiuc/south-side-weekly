import { Response } from '../types';
import { get, put } from '../builders';
import { PitchesResponse } from '../pitch/types';

import { UsersResponse, UserResponse, UserPermissions } from './types';

const USER_ENDPOINT = '/users';

// Returns all of the users in the database
const getUsers = async (): Promise<Response<UsersResponse>> =>
  await get(USER_ENDPOINT, 'GET_USERS_FAIL');

// Returns a single user from the user's id
const getUser = async (userId: string): Promise<Response<UserResponse>> =>
  await get(`${USER_ENDPOINT}/${userId}`, 'GET_USER_FAIL');

// Adds a pitch to a user's claimed pitches
const updateUserClaimedPitches = async (
  userId: string,
  pitchId: string,
): Promise<Response<PitchesResponse>> =>
  await put(
    `${USER_ENDPOINT}/${userId}/pitches`,
    { pitchId },
    'UPDATE_USER_PITCHES_FAIL',
  );

// Update a user's data
const updateUser = async (
  profileData: {
    [key: string]: string | boolean | string[] | Date | null;
  },
  userId: string,
): Promise<Response<UserResponse>> =>
  await put(`${USER_ENDPOINT}/${userId}`, profileData, 'UPDATE_USER_FAIL');

/**
 * Gets a user's permissions
 * Returns GET_USER_PERMISSIONS_FAIL upon failure
 */
export const getUserPermissionsByID = async (
  userId: string,
): Promise<Response<UserPermissions>> =>
  await get(
    `${USER_ENDPOINT}/${userId}/permissions`,
    'GET_USER_PERMISSIONS_FAIL',
  );

export { getUsers, getUser, updateUserClaimedPitches, updateUser };

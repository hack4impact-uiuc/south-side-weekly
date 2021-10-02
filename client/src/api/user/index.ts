import { IUser } from 'ssw-common';

import { Response } from '../types';
import { buildEndpoint, get, put } from '../builders';
import { PitchesResponse } from '../pitch/types';
import { onboardingStatusEnum } from '../../utils/enums';

import { UsersResponse, UserResponse, UserPermissions } from './types';

const USER_ENDPOINT = '/users';

// Returns all of the users in the database
const getUsers = async (): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT);
  const failureMessage = 'GET_USERS_FAIL';

  return await get(url, failureMessage);
};

// Returns a single user from the user's id
const getUser = async (userId: string): Promise<Response<UserResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, userId);
  const failureMessage = 'GET_USER_FAIL';

  return await get(url, failureMessage);
};

// Adds a pitch to a user's claimed pitches
const updateUserClaimedPitches = async (
  userId: string,
  pitchId: string,
): Promise<Response<PitchesResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, userId, 'pitches');
  const failureMessage = 'UPDATE_USER_PITCHES_FAIL';

  return await put(url, { pitchId }, failureMessage);
};

// Update a user's data
const updateUser = async (
  profileData: {
    [K in keyof IUser]?: IUser[K];
  },
  userId: string,
): Promise<Response<UserResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, userId);
  const failureMessage = 'UPDATE_USER_FAIL';

  return await put(url, profileData, failureMessage);
};

// Update user's onboarding status
const updateOnboardingStatus = async (
  userId: string,
  status: keyof typeof onboardingStatusEnum,
): Promise<Response<UserResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, userId);
  const failureMessage = 'UPDATE_USER_FAIL';
  const profileData = { onboardingStatus: status };

  return await put(url, profileData, failureMessage);
};

/**
 * Gets a user's permissions
 * Returns GET_USER_PERMISSIONS_FAIL upon failure
 */
export const getUserPermissionsByID = async (
  userId: string,
): Promise<Response<UserPermissions>> => {
  const url = buildEndpoint(USER_ENDPOINT, userId, 'permissions');
  const failureMessage = 'GET_USER_PERMISSIONS_FAIL';

  return await get(url, failureMessage);
};

export {
  getUsers,
  getUser,
  updateUserClaimedPitches,
  updateUser,
  updateOnboardingStatus
};

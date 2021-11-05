import { IUser } from 'ssw-common';

import { Response } from '../types';
import { buildEndpoint, get, post, put } from '../builders';
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

const getPendingContributors = async (): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'contributors', 'pending');
  const failureMessage = 'GET_PENDING_CONTRIBUTORS_FAIL';

  return await get(url, failureMessage);
};

const getPendingStaff = async (): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'staff', 'pending');
  const failureMessage = 'GET_PENDING_STAFF_FAIL';

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
  profileData: Partial<IUser>,
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

// Adds new page to user's list of visited pages
const addVisitedPage = async (
  page: string,
): Promise<Response<UserResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'visitPage');
  const failureMessage = 'UPDATE_VISITED_PAGES_FAIL';

  return await post(url, { page }, failureMessage);
};

const getAdmins = async (): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'all', 'admins');
  const failureMessage = 'GET_ADMINS_FAIL';

  return await get(url, failureMessage);
};

const getStaff = async (): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'all', 'staff');
  const failureMessage = 'GET_STAFF_FAIL';

  return await get(url, failureMessage);
};

const getUsersByTeam = async (
  teamName: string,
): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'all', 'team', teamName);
  const failureMessage = 'GET_USERS_BY_TEAM_FAIL';

  return await get(url, failureMessage);
};

export {
  getUsers,
  getPendingContributors,
  getPendingStaff,
  getUser,
  updateUserClaimedPitches,
  updateUser,
  updateOnboardingStatus,
  addVisitedPage,
  getAdmins,
  getStaff,
  getUsersByTeam,
};

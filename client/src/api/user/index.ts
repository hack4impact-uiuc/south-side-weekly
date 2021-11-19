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

// Returns all pending users
const getPendingUsers = async (): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'all', 'pending');
  const failureMessage = 'GET_PENDING_USERS_FAIL';

  return await get(url, failureMessage);
};

// Returns all approved users
const getApprovedUsers = async (): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'all', 'approved');
  const failureMessage = 'GET_APPROVED_USERS_FAIL';

  return await get(url, failureMessage);
};

// Returns all denied users
const getDeniedUsers = async (): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'all', 'denied');
  const failureMessage = 'GET_DENIED_USERS_FAIL';

  return await get(url, failureMessage);
};

// Returns all pending contributors
const getPendingContributors = async (): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'contributors', 'pending');
  const failureMessage = 'GET_PENDING_CONTRIBUTORS_FAIL';

  return await get(url, failureMessage);
};

// Returns all pending staff
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
// Will also send email here
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

const getUsersByTeam = async (
  teamName: string,
): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, 'all', 'team', teamName);
  const failureMessage = 'GET_USERS_BY_TEAM_FAIL';

  return await get(url, failureMessage);
};

// Approve user
const approveUser = async (
  userId: string,
): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, userId, 'approved');
  const failureMessage = 'APPROVE_USER_FAIL';
  return await put(url, onboardingStatusEnum.ONBOARDED, failureMessage);
};

const declineUser = async (
  userId: string,
): Promise<Response<UsersResponse>> => {
  const url = buildEndpoint(USER_ENDPOINT, userId, 'denied');
  const failureMessage = 'DECLINE_USER_FAIL';
  return await put(url, onboardingStatusEnum.DENIED, failureMessage);
};

export {
  getUsers,
  getPendingUsers,
  getApprovedUsers,
  getDeniedUsers,
  getPendingContributors,
  getPendingStaff,
  getUser,
  updateUserClaimedPitches,
  updateUser,
  updateOnboardingStatus,
  addVisitedPage,
  getUsersByTeam,
  approveUser,
  declineUser,
};

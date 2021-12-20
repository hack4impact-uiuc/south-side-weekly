import { IUser, IUserFeedback } from 'ssw-common';

import { Response } from '../types';
import { buildEndpoint, get, post, put } from '../builders';
import { PitchesResponse } from '../pitch/types';
import { onboardingStatusEnum } from '../../utils/enums';

import { UserFeedbackResponse } from './types';

const USER_FEEDBACK_ENDPOINT = '/userFeedback';

const addFeedback = async (
  newFeedback: Partial<IUserFeedback>,
): Promise<Response<UserFeedbackResponse>> => {
  const url = buildEndpoint(USER_FEEDBACK_ENDPOINT);
  const failureMessage = 'ADD_USER_FEEDBACK_FAIL';

  return await post(url, newFeedback, failureMessage);
};

const getUserFeedbackForPitch = async (
  userId: string,
  pitchId: string,
): Promise<Response<UserFeedbackResponse>> => {
  const url = buildEndpoint(USER_FEEDBACK_ENDPOINT, userId, pitchId);
  const failureMessage = 'GET_USER_FEEDBACK_ON_PITCH_FAIL';

  return await get(url, failureMessage);
};

// Updates the information on user feedback
const updateUserFeedback = async (
  userFeedbackData: Partial<IUserFeedback>,
  userFeedbackId: string,
): Promise<Response<UserFeedbackResponse>> => {
  const url = buildEndpoint(USER_FEEDBACK_ENDPOINT, userFeedbackId);
  const failureMessage = 'UPDATE_USER_FEEDBACK_FAIL';

  return await put(url, userFeedbackData, failureMessage);
};

export { addFeedback, getUserFeedbackForPitch, updateUserFeedback };

import { IPitch } from 'ssw-common';

import { Response } from '../types';
import { get, post, put, buildEndpoint } from '../builders';

import { GetOpenTeamsResponse, PitchesResponse, PitchResponse } from './types';

const PITCH_ENDPOINT = '/pitch';

type Pitches = Response<PitchesResponse>;

// Returns all of the approved pitches
const getApprovedPitches = async (): Promise<Pitches> => {
  const url = buildEndpoint(PITCH_ENDPOINT, 'all', 'approved');
  const failureMessage = 'GET_PITCHES_FAIL';

  return await get(url, failureMessage);
};

// Updates a pitch's contributors
const submitPitchClaim = async (
  pitchId: string,
  userId: string,
  teams: string[],
): Promise<Pitches> => {
  const url = buildEndpoint(PITCH_ENDPOINT, pitchId, 'submitClaim');
  const failureMessage = 'SUBMIT_PITCH_CLAIM_FAIL';

  return await put(url, { userId, teams }, failureMessage);
};

const approvePitch = async (
  pitchId: string,
  teams: IPitch['teams'],
): Promise<Response<PitchResponse>> => {
  const url = buildEndpoint(PITCH_ENDPOINT, pitchId, 'approve');
  const failureMessage = 'APPROVE_CLAIM_FAIL';

  return await put(url, { teams }, failureMessage);
};

const declinePitch = async (
  pitchId: string,
): Promise<Response<PitchResponse>> => {
  const url = buildEndpoint(PITCH_ENDPOINT, pitchId, 'decline');
  const failureMessage = 'DECLINE_CLAIM_FAIL';

  return await put(url, {}, failureMessage);
};

// Updates the information on a pitch
const updatePitch = async (
  pitchData: Partial<IPitch>,
  pitchId: string,
): Promise<Pitches> => {
  const url = buildEndpoint(PITCH_ENDPOINT, pitchId);
  const failureMessage = 'UPDATE_PITCH_FAIL';

  return await put(url, pitchData, failureMessage);
};

const getPitchesPendingApproval = async (): Promise<Pitches> => {
  const url = buildEndpoint(PITCH_ENDPOINT, 'all', 'pending');
  const failureMessage = 'GET_PENDING_PITCHES_FAIL';

  return await get(url, failureMessage);
};

const getUnclaimedPitches = async (): Promise<Pitches> => {
  const url = buildEndpoint(PITCH_ENDPOINT, 'all', 'approved').concat(
    '?status=unclaimed',
  );
  const failureMessage = 'GET_UNCLAIMED_FAIL';

  return await get(url, failureMessage);
};

const getPendingContributorPitches = async (): Promise<Pitches> => {
  const url = buildEndpoint(PITCH_ENDPOINT, 'all', 'pendingClaims');
  const failureMessage = 'GET_PENDING_CONTRIBUTOR_FAIL';

  return await get(url, failureMessage);
};

const createPitch = async (newPitch: {
  [key: string]: number | string | string[] | boolean;
}): Promise<Response<PitchResponse>> => {
  const url = buildEndpoint(PITCH_ENDPOINT);
  const failureMessage = 'CREATE_PITCH_FAIL';

  return await post(url, newPitch, failureMessage);
};

export {
  getApprovedPitches,
  submitPitchClaim,
  updatePitch,
  getPitchesPendingApproval,
  getPendingContributorPitches,
  createPitch,
  getUnclaimedPitches,
  approvePitch,
  declinePitch,
};

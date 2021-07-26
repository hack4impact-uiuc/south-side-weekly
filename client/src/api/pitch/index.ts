import { IPitch } from 'ssw-common';

import { Response } from '../types';
import { get, post, put } from '../builders';

import { GetOpenTeamsResponse, PitchesResponse, PitchResponse } from './types';

const PITCH_ENDPOINT = '/pitch';

type Pitches = Response<PitchesResponse>;

// Returns all of the approved pitches
const getApprovedPitches = async (): Promise<Pitches> =>
  await get(`${PITCH_ENDPOINT}?approved=true`, 'GET_PITCH_FAIL');

// Returns the teams that can still claim a specified pitch
const getOpenTeams = async (
  pitchId: string,
): Promise<Response<GetOpenTeamsResponse>> =>
  await get(`${PITCH_ENDPOINT}/${pitchId}/openTeams`, 'GET_OPEN_TEAMS_FAIL');

// Updates a pitch's contributors
const updatePitchContributors = async (
  pitchId: string,
  userId: string,
): Promise<Pitches> =>
  await put(
    `${PITCH_ENDPOINT}/${pitchId}/contributors`,
    { userId },
    'UPDATE_CONTRIBUTORS_FAIL',
  );

// Updates the information on a pitch
const updatePitch = async (
  pitchData: { [key: string]: string[] | string | number | IPitch['teams'] },
  pitchId: string,
): Promise<Pitches> =>
  await put(`${PITCH_ENDPOINT}/${pitchId}`, pitchData, 'UPDATE_PITCH_FAIL');

const getPendingPitches = async (): Promise<Pitches> =>
  await get(`${PITCH_ENDPOINT}?pending=true`, 'GET_PENDING_PITCHES_FAIL');

const getPendingContributorPitches = async (): Promise<Pitches> =>
  await get(`${PITCH_ENDPOINT}/all/pending`, 'GET_PENDING_CONTRIBUTOR_FAIL');

const createPitch = async (newPitch: {
  [key: string]: number | string | string[];
}): Promise<Response<PitchResponse>> =>
  await post(PITCH_ENDPOINT, newPitch, 'CREATE_PITCH_FAIL');

export {
  getApprovedPitches,
  getOpenTeams,
  updatePitchContributors,
  updatePitch,
  getPendingPitches,
  getPendingContributorPitches,
  createPitch,
};

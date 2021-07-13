import { AxiosResponse } from 'axios';

import { ErrorWrapper } from '../types';
import { get, put } from '../builders';

import * as Types from './types';

const PITCH_ENDPOINT = '/pitch';

// Returns all of the approved pitches
const getApprovedPitches = async (): Promise<
  AxiosResponse<Types.GetPitchesResponseType> | ErrorWrapper
> => await get(`${PITCH_ENDPOINT}?approved=true`, 'GET_PITCH_FAIL');

// Returns the teams that can still claim a specified pitch
const getOpenTeams = async (
  pitchId: string,
): Promise<AxiosResponse<Types.GetOpenTeamsResponseType> | ErrorWrapper> =>
  await get(`${PITCH_ENDPOINT}/${pitchId}/openTeams`, 'GET_OPEN_TEAMS_FAIL');

// Updates a pitch's contributors
const updatePitchContributors = async (
  pitchId: string,
  userId: string,
): Promise<AxiosResponse<Types.GetPitchesResponseType> | ErrorWrapper> =>
  await put(
    `${PITCH_ENDPOINT}/${pitchId}/contributors`,
    { userId },
    'UPDATE_PITCH_CONTRIBUTORS_FAIL',
  );

// Updates the information on a pitch
const updatePitch = async (
  pitchData: { [key: string]: number | string },
  pitchId: string,
): Promise<AxiosResponse<Types.GetPitchesResponseType> | ErrorWrapper> =>
  await put(`${PITCH_ENDPOINT}/${pitchId}`, pitchData, 'UPDATE_PITCH_FAIL');

const getPendingPitches = async (): Promise<
  AxiosResponse<Types.GetPitchesResponseType> | ErrorWrapper
> => await get(`${PITCH_ENDPOINT}?pending=true`, 'GET_PENDING_PITCHES_FAIL');

export {
  getApprovedPitches,
  getOpenTeams,
  updatePitchContributors,
  updatePitch,
  getPendingPitches,
};

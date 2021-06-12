import { AxiosResponse } from 'axios';

import { ErrorWrapper } from '../types';
import { get, put } from '../builders';

import * as Types from './types';

const PITCH_ENDPOINT = '/pitch';

const getApprovedPitches = async (): Promise<
  AxiosResponse<Types.GetPitchesResponseType> | ErrorWrapper
> => await get(`${PITCH_ENDPOINT}?approved=true`, 'GET_PITCH_FAIL');

const getOpenTeams = async (
  pitchId: string,
): Promise<AxiosResponse<Types.GetOpenTeamsResponseType> | ErrorWrapper> =>
  await get(`${PITCH_ENDPOINT}/${pitchId}/openTeams`, 'GET_OPEN_TEAMS_FAIL');

const updatePitchContributors = async (
  userId: string,
  pitchId: string,
): Promise<AxiosResponse<Types.GetPitchesResponseType> | ErrorWrapper> =>
  await put(
    `${PITCH_ENDPOINT}/${pitchId}/contributors`,
    userId,
    'UPDATE_PITCH_CONTRIBUTORS_FAIL',
  );

const updatePitch = async (
  pitchData: { [key: string]: number | string },
  pitchId: string,
): Promise<AxiosResponse<Types.GetPitchesResponseType> | ErrorWrapper> =>
  await put(`${PITCH_ENDPOINT}/${pitchId}`, pitchData, 'UPDATE_PITCH_FAIL');

export {
  getApprovedPitches,
  getOpenTeams,
  updatePitchContributors,
  updatePitch,
};

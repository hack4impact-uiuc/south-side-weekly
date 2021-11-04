import { ITeam } from 'ssw-common';

import { get, buildEndpoint, post, put } from '../builders';
import { ApiResponseBase, Response } from '../types';

import { TeamsResponse } from './types';

const TEAMS_ENDPOINT = '/teams';

// Returns all of the teams
const getTeams = async (): Promise<Response<TeamsResponse>> => {
  const url = buildEndpoint(TEAMS_ENDPOINT);
  const failureMessage = 'GET_TEAMS_FAIL';

  return await get(url, failureMessage);
};

const createManyTeams = async (
  teams: Partial<ITeam>[],
): Promise<Response<ApiResponseBase>> => {
  const url = buildEndpoint(TEAMS_ENDPOINT, 'many');
  const failureMessage = 'CREATE_MANY_TEAMS_FAIL';

  return await post(url, { teams }, failureMessage);
};

const updateManyTeams = async (
  teams: ITeam[],
): Promise<Response<ApiResponseBase>> => {
  const url = buildEndpoint(TEAMS_ENDPOINT, 'update', 'many');
  const failureMessage = 'UPDATE_MANY_TEAMS_FAIL';

  return await put(url, { teams }, failureMessage);
};

export { getTeams, createManyTeams, updateManyTeams };

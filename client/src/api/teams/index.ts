import { ITeam } from 'ssw-common';

import { Response } from '../types';
import { get, post, put, buildEndpoint } from '../builders';

import { TeamsResponse, TeamResponse } from './types';

const TEAMS_ENDPOINT = '/teams';

type Teams = Response<TeamsResponse>;

// Returns all of the teams
const getTeams = async (): Promise<Response<TeamsResponse>> => {
  const url = buildEndpoint(TEAMS_ENDPOINT);
  const failureMessage = 'GET_TEAMS_FAIL';

  return await get(url, failureMessage);
};

export { getTeams };

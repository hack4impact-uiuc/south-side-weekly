import { Response } from '../types';
import { get, buildEndpoint } from '../builders';

import { TeamsResponse } from './types';

const TEAMS_ENDPOINT = '/teams';

// Returns all of the teams
const getTeams = async (): Promise<Response<TeamsResponse>> => {
  const url = buildEndpoint(TEAMS_ENDPOINT);
  const failureMessage = 'GET_TEAMS_FAIL';

  return await get(url, failureMessage);
};

export { getTeams };

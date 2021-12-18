import { buildPath } from '../utils';

export const getTeams = buildPath({
  method: 'GET',
  model: 'Team',
  opId: 'getTeams',
  description: 'Gets all teams',
});

export const getTeam = buildPath({
  method: 'GET',
  model: 'Team',
  opId: 'getTeam',
  description: 'Gets a team by id',
  params: [
    {
      name: 'id',
      description: 'The id of the team to get',
    },
  ],
});

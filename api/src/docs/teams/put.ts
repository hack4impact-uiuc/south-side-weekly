import { teamBody } from '../schemas/team';
import { buildPath } from '../utils';

export const updateTeam = buildPath({
  method: 'PUT',
  model: 'Team',
  opId: 'updateTeam',
  description: 'Updates a team with data in the body',
  params: [
    {
      name: 'id',
      description: 'The id of the team to update',
    },
  ],
  body: {
    description: 'The data to update the team with',
    schema: {
      type: 'object',
      properties: {
        ...teamBody,
      },
    },
  },
});

export const updateManyTeams = buildPath({
  method: 'PUT',
  model: 'Team',
  opId: 'updateManyTeams',
  description: 'Updates many teams with data in the body',
  body: {
    description: 'The data to update the teams with',
    schema: {
      type: 'object',
      properties: {
        teams: {
          type: 'array',
          items: {
            ...teamBody,
          },
        },
      },
    },
  },
});

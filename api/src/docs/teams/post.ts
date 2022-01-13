import { teamBody } from '../schemas/team';
import { buildPath } from '../utils';

export const createTeam = buildPath({
  method: 'POST',
  model: 'Team',
  opId: 'createTeam',
  description: 'Creates a team with data in the body',
  body: {
    description: 'The data to create the team with',
    schema: {
      type: 'object',
      properties: {
        ...teamBody,
      },
    },
  },
});

export const createManyTeams = buildPath({
  method: 'POST',
  model: 'Team',
  opId: 'createManyTeams',
  description: 'Creates many teams with data in the body',
  body: {
    description: 'The data to create the teams with',
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

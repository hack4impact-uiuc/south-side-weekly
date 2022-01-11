import { getTeam, getTeams } from './get';
import { updateTeam, updateManyTeams } from './put';
import { createTeam, createManyTeams } from './post';

export const teamPaths = {
  '/teams': {
    ...getTeams,
    ...updateManyTeams,
    ...createManyTeams,
    ...createTeam,
  },
  '/teams/{id}': {
    ...getTeam,
    ...updateTeam,
  },
};

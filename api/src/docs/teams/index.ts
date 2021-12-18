import { getTeam, getTeams } from './get';
import { updateTeam, updateManyTeams } from './update';
import { createTeam, createManyTeams } from './create';

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

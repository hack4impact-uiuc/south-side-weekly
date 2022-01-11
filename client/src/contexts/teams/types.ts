import { Team } from 'ssw-common';

export interface ITeamsContext {
  teams: Team[];
  getTeamFromId: (id: string) => Team;
  fetchTeams: () => void;
}

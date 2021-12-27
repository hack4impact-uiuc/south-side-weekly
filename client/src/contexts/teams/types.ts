import { ITeam, Team } from 'ssw-common';

export interface ITeamsContext {
  teams: ITeam[];
  getTeamFromId: (id: string) => Team;
  fetchTeams: () => void;
}

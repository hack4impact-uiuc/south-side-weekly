import { ITeam } from 'ssw-common';

export interface ITeamsContext {
  teams: ITeam[];
  getTeamFromId: (id: string) => ITeam | undefined;
}

import { IPitch } from 'ssw-common';

export const isPitchClaimed = (pitch: IPitch): boolean =>
  getOpenTeamsForPitch(pitch).length === 0;

export const getOpenTeamsForPitch = (pitch: IPitch): string[] => {
  const openTeams: string[] = [];
  if (pitch.teams) {
    [...pitch.teams.entries()].forEach(([team, spots]) => {
      if (spots > 0) {
        openTeams.push(team);
      }
    });
  }
  return openTeams;
};

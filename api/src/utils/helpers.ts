import { IPitch } from 'ssw-common';

export const isPitchClaimed = (pitch: IPitch): boolean =>
  getOpenTeamsForPitch(pitch).length === 0;

export const getOpenTeamsForPitch = (pitch: IPitch): IPitch['teams'] => {
  console.log("TEAMS:", pitch.teams);
  let openTeams:IPitch['teams'] = [];
  if (pitch.teams !== null && pitch.teams.length !== undefined) {
     openTeams = pitch.teams.filter((team) => team.target > 0)
  }
  console.log("OPEN: ", openTeams);
  return openTeams;
};

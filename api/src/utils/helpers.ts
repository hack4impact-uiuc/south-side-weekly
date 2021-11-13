import { IPitch } from 'ssw-common';

export const isPitchClaimed = (pitch: IPitch): boolean =>
  getOpenTeamsForPitch(pitch).length === 0;

export const getOpenTeamsForPitch = (pitch: IPitch): IPitch['teams'] => {
  let openTeams: IPitch['teams'] = [];
  if (pitch.teams !== null && pitch.teams.length !== undefined) {
    openTeams = pitch.teams.filter((team) => team.target > 0);
  }
  return openTeams;
};

export const updatePitchTeamTargets = (
  pitch: IPitch,
  teams: string[],
): void => {
  teams.forEach((teamId) => {
    const team = pitch.teams.find(
      ({ teamId: pitchTeamId }) => pitchTeamId === teamId,
    );

    team.target--;
  });
};

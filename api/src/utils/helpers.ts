import { Response } from 'express';
import { IPitch, IUser } from 'ssw-common';

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

export const sendSuccess = (
  res: Response,
  message: string,
  result?: unknown,
): Response =>
  res.status(200).json({
    success: true,
    message,
    result,
  });

export const sendNotFound = (res: Response, message: string): Response =>
  res.status(404).json({
    success: false,
    message,
  });

export const sendFail = (
  res: Response,
  message: string,
  error?: unknown,
): Response =>
  res.status(400).json({
    success: false,
    message,
    error,
  });

export const getUserFulName = (user: IUser): string =>
  `${user.preferredName || user.firstName} ${user.lastName}`;

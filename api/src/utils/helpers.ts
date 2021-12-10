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

export const sendResponse = (
  res: Response,
  status: number,
  message: string,
  result?: unknown,
): Response =>
  res.status(status).json({
    success: status >= 200 && status < 300,
    message,
    result,
  });

export const sendSuccess = (
  res: Response,
  message: string,
  result?: unknown,
): Response => sendResponse(res, 200, message, result);

export const sendNotFound = (res: Response, message: string): Response =>
  sendResponse(res, 404, message);

export const sendFail = (res: Response, message: string): Response =>
  sendResponse(res, 400, message);

export const getUserFulName = (user: IUser): string =>
  `${user.preferredName || user.firstName} ${user.lastName}`;

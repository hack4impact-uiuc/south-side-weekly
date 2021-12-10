import { Request, Response } from 'express';
import { ITeam } from 'ssw-common';
import Team from '../models/team';
import { sendFail, sendNotFound, sendSuccess } from '../utils/helpers';

type IdParam = { id: string };

// CREATE controls

type CreateReqQuery = Partial<ITeam>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createTeam = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const team = await Team.create(req.body);

  sendSuccess(res, 'Team created', team);
};

type CreateManyBodyReq = { teams: Partial<ITeam>[] };
type CreateManyReq = Request<never, never, CreateManyBodyReq>;

export const createTeams = async (
  req: CreateManyReq,
  res: Response,
): Promise<void> => {
  const createdTeams = await Promise.all(
    req.body.teams.map(async (team) => Team.create(team)),
  );

  const failedTeams = createdTeams.filter((team) => !team);

  if (failedTeams.length > 0) {
    const failedTeamNames = failedTeams.map((team) => team.name);

    sendFail(res, `Failed to create teams: ${failedTeamNames.join(', ')}`);
    return;
  }

  sendSuccess(res, 'Teams created', createdTeams);
};

// READ controls

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  const teams = await Team.find({});

  sendSuccess(res, 'Teams retrieved', teams);
};

type GetIdReq = Request<IdParam>;

export const getTeam = async (req: GetIdReq, res: Response): Promise<void> => {
  const team = await Team.findById(req.params.id);

  sendSuccess(res, 'Team retrieved', team);
};

// UPDATE controls

type UpdateIdReq = Request<IdParam, never, Partial<ITeam>>;

export const updateTeam = async (
  req: UpdateIdReq,
  res: Response,
): Promise<void> => {
  const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!team) {
    sendNotFound(res, 'Team not found');
    return;
  }

  sendSuccess(res, 'Team updated', team);
};

type UpdateManyReqBody = { teams: Partial<ITeam>[] };
type UpdateManyReq = Request<never, never, UpdateManyReqBody>;

export const updateTeams = async (
  req: UpdateManyReq,
  res: Response,
): Promise<void> => {
  const updatedTeams = await Promise.all(
    req.body.teams.map(async (team) =>
      Team.findByIdAndUpdate(
        team._id,
        {
          name: team.name,
          color: team.color,
          active: team.active,
        },
        {
          new: true,
          runValidators: true,
        },
      ),
    ),
  );

  const failedTeams = updatedTeams.filter((team) => !team);

  if (failedTeams.length > 0) {
    const failedTeamNames = failedTeams.map((team) => team.name);

    sendFail(res, `Failed to update teams: ${failedTeamNames.join(', ')}`);
    return;
  }

  sendSuccess(res, 'Teams updated', updatedTeams);
};

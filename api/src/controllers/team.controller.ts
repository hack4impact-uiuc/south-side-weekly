import { Request, Response } from 'express';
import { ITeam } from 'ssw-common';

import { sendNotFound, sendSuccess } from '../utils/helpers';
import { TeamService } from '../services';

type IdParam = { id: string };

// CREATE controls

type CreateReqQuery = Partial<ITeam>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createTeam = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const team = await TeamService.add(req.body);

  sendSuccess(res, 'Team created', team);
};

type CreateManyBodyReq = { teams: Partial<ITeam>[] };
type CreateManyReq = Request<never, never, CreateManyBodyReq>;

export const createTeams = async (
  req: CreateManyReq,
  res: Response,
): Promise<void> => {
  const teams = await TeamService.addMany(req.body.teams);

  sendSuccess(res, 'Teams created', teams);
};

// READ controls

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  const teams = await TeamService.getAll();

  sendSuccess(res, 'Teams retrieved', teams);
};

type GetIdReq = Request<IdParam>;

export const getTeam = async (req: GetIdReq, res: Response): Promise<void> => {
  const team = await TeamService.getOne(req.params.id);

  sendSuccess(res, 'Team retrieved', team);
};

// UPDATE controls

type UpdateIdReq = Request<IdParam, never, Partial<ITeam>>;

export const updateTeam = async (
  req: UpdateIdReq,
  res: Response,
): Promise<void> => {
  const team = await TeamService.update(req.params.id, req.body);

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
  const teams = await TeamService.updateMany(req.body.teams);

  sendSuccess(res, 'Teams updated', teams);
};

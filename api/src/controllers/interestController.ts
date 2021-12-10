import { Request, Response } from 'express';
import { IInterest } from 'ssw-common';
import Interest from '../models/interest';
import { sendFail, sendNotFound, sendSuccess } from '../utils/helpers';

type IdParam = { id: string };

// CREATE controls

type CreateReqQuery = Partial<IInterest>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createInterest = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const team = await Interest.create(req.body);

  sendSuccess(res, 'Interest created', team);
};

type CreateManyBodyReq = { teams: Partial<IInterest>[] };
type CreateManyReq = Request<never, never, CreateManyBodyReq>;

export const createInterests = async (
  req: CreateManyReq,
  res: Response,
): Promise<void> => {
  const createdInterests = await Promise.all(
    req.body.teams.map(async (team) => Interest.create(team)),
  );

  const failedInterests = createdInterests.filter((team) => !team);

  if (failedInterests.length > 0) {
    const failedInterestNames = failedInterests.map((team) => team.name);

    sendFail(res, `Failed to create teams: ${failedInterestNames.join(', ')}`);
    return;
  }

  sendSuccess(res, 'Interests created', createdInterests);
};

// READ controls

export const getInterests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const teams = await Interest.find({});

  sendSuccess(res, 'Interests retrieved', teams);
};

type GetIdReq = Request<IdParam>;

export const getInterest = async (
  req: GetIdReq,
  res: Response,
): Promise<void> => {
  const team = await Interest.findById(req.params.id);

  sendSuccess(res, 'Interest retrieved', team);
};

// UPDATE controls

type UpdateIdReq = Request<IdParam, never, Partial<IInterest>>;

export const updatedInterest = async (
  req: UpdateIdReq,
  res: Response,
): Promise<void> => {
  const team = await Interest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!team) {
    sendNotFound(res, 'Interest not found');
    return;
  }

  sendSuccess(res, 'Interest updated', team);
};

type UpdateManyReqBody = { teams: Partial<IInterest>[] };
type UpdateManyReq = Request<never, never, UpdateManyReqBody>;

export const updateInterests = async (
  req: UpdateManyReq,
  res: Response,
): Promise<void> => {
  const updatedInterests = await Promise.all(
    req.body.teams.map(async (team) =>
      Interest.findByIdAndUpdate(
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

  const failedInterests = updatedInterests.filter((team) => !team);

  if (failedInterests.length > 0) {
    const failedInterestNames = failedInterests.map((team) => team.name);

    sendFail(res, `Failed to update teams: ${failedInterestNames.join(', ')}`);
    return;
  }

  sendSuccess(res, 'Interests updated', updatedInterests);
};

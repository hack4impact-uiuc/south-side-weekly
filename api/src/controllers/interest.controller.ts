import { Request, Response } from 'express';
import { IInterest } from 'ssw-common';

import { sendNotFound, sendSuccess } from '../utils/helpers';
import { InterestService } from '../services';

type IdParam = { id: string };

// CREATE controls

type CreateReqQuery = Partial<IInterest>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createInterest = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const interest = await InterestService.add(req.body);

  sendSuccess(res, 'Interest created', interest);
};

type CreateManyBodyReq = { interests: Partial<IInterest>[] };
type CreateManyReq = Request<never, never, CreateManyBodyReq>;

export const createInterests = async (
  req: CreateManyReq,
  res: Response,
): Promise<void> => {
  const interests = await InterestService.addMany(req.body.interests);

  sendSuccess(res, 'Interests created', interests);
};

// READ controls

export const getInterests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const interests = await InterestService.getAll();

  sendSuccess(res, 'Interests retrieved', interests);
};

type GetIdReq = Request<IdParam>;

export const getInterest = async (
  req: GetIdReq,
  res: Response,
): Promise<void> => {
  const interest = await InterestService.getOne(req.params.id);

  sendSuccess(res, 'Interest retrieved', interest);
};

// UPDATE controls

type UpdateIdReq = Request<IdParam, never, Partial<IInterest>>;

export const updatedInterest = async (
  req: UpdateIdReq,
  res: Response,
): Promise<void> => {
  const interest = await InterestService.update(req.params.id, req.body);

  if (!interest) {
    sendNotFound(res, 'Interest not found');
    return;
  }

  sendSuccess(res, 'Interest updated', interest);
};

type UpdateManyReqBody = { interests: Partial<IInterest>[] };
type UpdateManyReq = Request<never, never, UpdateManyReqBody>;

export const updateInterests = async (
  req: UpdateManyReq,
  res: Response,
): Promise<void> => {
  const interests = await InterestService.updateMany(req.body.interests);

  sendSuccess(res, 'Interests updated', interests);
};

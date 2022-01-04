import { Request, Response } from 'express';
import { BasePopulatedPitch, IPitch } from 'ssw-common';

import {
  sendApprovedPitchMail,
  sendClaimRequestApprovedMail,
  sendClaimRequestDeclinedMail,
  sendDeclinedPitchMail,
} from '../mail/sender';
import { populatePitch } from '../populators';
import { PitchService, UserService } from '../services';
import { sendFail, sendNotFound, sendSuccess } from '../utils/helpers';
import { extractOptions, extractPopulateQuery } from './utils';

type IdParam = { id: string };

// CREATE controls

type CreateReqQuery = Partial<IPitch>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createPitch = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const newPitch = await PitchService.add(req.body);

  if (newPitch) {
    sendSuccess(res, 'Pitch created successfully', newPitch);
  }
};

// READ controls

export const getPitches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getAll(options);

  sendSuccess(res, 'Pitches retrieved successfully', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

type GetPitchesReq = Request<IdParam>;

export const getPitch = async (
  req: GetPitchesReq,
  res: Response,
): Promise<void> => {
  const pitch = await PitchService.getOne(req.params.id);

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Pitch retrieved successfully',
    await populatePitch(pitch, populateType),
  );
};

export const getPendingPitches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getPendingPitches(options);

  sendSuccess(res, 'Pitches retrieved successfully', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

type GetApprovedPitchesReqQuery = { status: string };
type GetApprovedPitchesReq = Request<never, never, GetApprovedPitchesReqQuery>;

export const getApprovedPitches = async (
  req: GetApprovedPitchesReq,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getApprovedPitches(
    req.query.status as string | undefined,
    options,
  );

  sendSuccess(res, 'Successfully retrieved all approved pitches', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

export const getPitchesWithPendingClaims = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getPendingClaimPitches(options);

  sendSuccess(res, 'Pitches retrieved successfully', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

export const getClaimablePitches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.params.userId;

  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getClaimablePitches(userId, options);

  sendSuccess(res, 'Pitches retrieved successfully', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

// UPDATE controls

type UpdateReqBody = Partial<IPitch>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updatePitch = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const updatedPitch = await PitchService.update(req.params.id, req.body);

  if (!updatedPitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Pitch updated successfully',
    await populatePitch(updatedPitch, populateType),
  );
};

export const approvePitch = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const pitch = await PitchService.approvePitch(
    req.params.id,
    req.user._id,
    req.body,
  );
  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populatedPitch = (await populatePitch(
    pitch,
    'default',
  )) as BasePopulatedPitch;

  sendApprovedPitchMail(
    populatedPitch.author,
    populatedPitch.reviewedBy,
    populatedPitch,
    req.body.writer !== null,
  );

  sendSuccess(res, 'Pitch approved successfully', pitch);
};

type DeclineReqBody = {
  reasoning: string;
};
type DeclineReq = Request<IdParam, never, DeclineReqBody, never>;

export const declinePitch = async (
  req: DeclineReq,
  res: Response,
): Promise<void> => {
  const pitch = await PitchService.declinePitch(req.params.id, req.user._id);

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populatedPitch = (await populatePitch(
    pitch,
    'default',
  )) as BasePopulatedPitch;

  sendDeclinedPitchMail(
    populatedPitch.author,
    req.user,
    populatedPitch,
    req.body.reasoning,
  );

  sendSuccess(res, 'Pitch declined successfully', populatedPitch);
};

type SubmitClaimReqBody = { userId: string; teams: string[]; message: string };
type SubmitClaimReq = Request<IdParam, never, SubmitClaimReqBody, never>;

export const submitClaim = async (
  req: SubmitClaimReq,
  res: Response,
): Promise<void> => {
  if (!UserService.isValidId(req.body.userId)) {
    sendNotFound(res, `User with id ${req.body.userId} not found`);
    return;
  }

  const updatedPitch = await PitchService.submitClaim(
    req.params.id,
    req.body.userId,
    req.body.teams,
    req.body.message,
  );

  await UserService.addClaimRequest(req.body.userId, req.params.id);

  if (!updatedPitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Claim submitted successfully',
    await populatePitch(updatedPitch, populateType),
  );
};

type ApproveClaimReqBody = { userId: string; teams: string[] };
type ApproveClaimReq = Request<IdParam, never, ApproveClaimReqBody, never>;

export const approveClaimRequest = async (
  req: ApproveClaimReq,
  res: Response,
): Promise<void> => {
  const { userId, teams } = req.body;

  const pitch = await PitchService.approveClaimRequest(
    req.params.id,
    userId,
    teams,
  );

  const user = await UserService.receiveClaimRequestApproval(
    userId,
    req.params.id,
  );

  if (!user) {
    sendNotFound(res, `User with id ${userId} not found`);
    return;
  } else if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  sendClaimRequestApprovedMail(user, pitch, req.user);

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Claim approved successfully',
    await populatePitch(pitch, populateType),
  );
};

type DeclineClaimReqBody = { userId: string };
type DeclineClaimReq = Request<IdParam, never, DeclineClaimReqBody, never>;

export const declineClaimRequest = async (
  req: DeclineClaimReq,
  res: Response,
): Promise<void> => {
  const { userId } = req.body;

  if (!userId) {
    sendFail(res, 'User id is required');
    return;
  }

  const pitch = await PitchService.declineClaimRequest(req.params.id, userId);

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const user = await UserService.removeClaimRequest(userId, req.params.id);

  if (!user) {
    sendNotFound(res, `User with id ${userId} not found`);
    return;
  }

  sendClaimRequestDeclinedMail(user, req.user, pitch);

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Claim declined successfully',
    await populatePitch(pitch, populateType),
  );
};

// DELETE controls

type DeletePitchReq = Request<IdParam>;

export const deletePitch = async (
  req: DeletePitchReq,
  res: Response,
): Promise<void> => {
  const deletedPitch = await PitchService.remove(req.params.id);

  if (!deletedPitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Pitch deleted successfully',
    await populatePitch(deletedPitch, populateType),
  );
};

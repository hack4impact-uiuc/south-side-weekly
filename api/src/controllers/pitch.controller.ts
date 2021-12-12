import { Request, Response } from 'express';
import { IPitch } from 'ssw-common';

import { sendClaimRequestApprovedMail } from '../mail/sender';
import { PitchService, UserService } from '../services';
import { aggregatePitch } from '../utils/aggregate-utils';
import { sendFail, sendNotFound, sendSuccess } from '../utils/helpers';
import { sendMail } from '../utils/mailer';
import {
  approvedMessage,
  declineClaim,
  declinedMessage,
} from '../utils/mailer-templates';

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
  const pitches = await PitchService.getAll();

  sendSuccess(res, 'Pitches retrieved successfully', pitches);
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

  sendSuccess(res, 'Pitch retrieved successfully', pitch);
};

export const getPendingPitches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const pitches = await PitchService.getPendingPitches();

  sendSuccess(res, 'Pitches retrieved successfully', pitches);
};

type GetApprovedPitchesReqQuery = { status: string };
type GetApprovedPitchesReq = Request<never, never, GetApprovedPitchesReqQuery>;

export const getApprovedPitches = async (
  req: GetApprovedPitchesReq,
  res: Response,
): Promise<void> => {
  const pitches = await PitchService.getApprovedPitches(
    req.query.status as string | undefined,
  );

  sendSuccess(res, 'Successfully retrieved all approved pitches', pitches);
};

export const getPitchesWithPendingClaims = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const pitches = await PitchService.getPendingClaimPitches();

  sendSuccess(res, 'Pitches retrieved successfully', pitches);
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

  sendSuccess(res, 'Pitch updated successfully', updatedPitch);
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

  // TODO: remove this and use populate
  const aggregatedPitch = await aggregatePitch(pitch);
  const message = approvedMessage(aggregatedPitch, req.user);

  sendMail(message);

  sendSuccess(res, 'Pitch approved successfully', pitch);
};

type DeclineReq = Request<IdParam>;

export const declinePitch = async (
  req: DeclineReq,
  res: Response,
): Promise<void> => {
  const pitch = await PitchService.declinePitch(req.params.id, req.user._id);

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }
  const aggregatedPitch = await aggregatePitch(pitch);
  const message = declinedMessage(aggregatedPitch, req.user);

  sendMail(message);

  sendSuccess(res, 'Pitch declined successfully', pitch);
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

  sendSuccess(res, 'Claim submitted successfully', updatedPitch);
};

type ApproveClaimReqBody = { userId: string; teams: string[] };
type ApproveClaimReq = Request<IdParam, never, ApproveClaimReqBody, never>;

export const approveClaimRequest = async (
  req: ApproveClaimReq,
  res: Response,
): Promise<void> => {
  const { userId, teams } = req.body;
  // Remove the user from the pending contributors and add it to the the assignment contributors
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

  sendSuccess(res, 'Claim approved successfully', pitch);
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

  const claimUser = await UserService.getOne(userId);
  const aggregatedPitch = await aggregatePitch(pitch);
  const message = declineClaim(claimUser, aggregatedPitch, req.user);

  sendMail(message);

  sendSuccess(res, 'Claim declined successfully', pitch);
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

  sendSuccess(res, 'Pitch deleted successfully', deletedPitch);
};

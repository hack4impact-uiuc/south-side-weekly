import { Request, Response } from 'express';
import { IPitch } from 'ssw-common';
import { sendClaimRequestApprovedMail } from '../mail/sender';

import Pitch from '../models/pitch';
import User from '../models/user';
import { aggregatePitch } from '../utils/aggregate-utils';

import { pitchStatusEnum } from '../utils/enums';
import {
  isPitchClaimed,
  sendFail,
  sendNotFound,
  sendSuccess,
} from '../utils/helpers';
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
  const newPitch = await Pitch.create(req.body);

  await User.findByIdAndUpdate(newPitch.author, {
    $addToSet: {
      submittedPitches: newPitch._id,
    },
    lastActive: new Date(),
  });

  if (newPitch) {
    sendSuccess(res, 'Pitch created successfully', newPitch);
  }
};

// READ controls

export const getPitches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const pitches = await Pitch.find({});

  sendSuccess(res, 'Pitches retrieved successfully', pitches);
};

type GetPitchesReq = Request<IdParam>;

export const getPitch = async (
  req: GetPitchesReq,
  res: Response,
): Promise<void> => {
  const pitch = await Pitch.findById(req.params.id);
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
  const pitches = await Pitch.find({
    status: pitchStatusEnum.PENDING,
  });

  sendSuccess(res, 'Pitches retrieved successfully', pitches);
};

type GetApprovedPitchesReqQuery = { status: string };
type GetApprovedPitchesReq = Request<never, never, GetApprovedPitchesReqQuery>;

export const getApprovedPitches = async (
  req: GetApprovedPitchesReq,
  res: Response,
): Promise<void> => {
  const approvedPitches = await Pitch.find({
    status: pitchStatusEnum.APPROVED,
  });

  const status = req.query.status;

  let pitches = approvedPitches;
  let message = '';

  const isPitchUnclaimed = (pitch: IPitch): boolean => !isPitchClaimed(pitch);

  if (status === 'unclaimed') {
    pitches = approvedPitches.filter(isPitchUnclaimed);
    message = 'Unclaimed pitches retrieved successfully';
  } else if (status === 'claimed') {
    pitches = approvedPitches.filter(isPitchClaimed);
    message = 'Claimed pitches retrieved successfully';
  }

  sendSuccess(res, message, pitches);
};

export const getPitchesWithPendingClaims = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const pitches = await Pitch.find({
    'pendingContributors.0': { $exists: true },
  });

  sendSuccess(res, 'Pitches retrieved successfully', pitches);
};

// UPDATE controls

type UpdateReqBody = Partial<IPitch>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updatePitch = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const updatedPitch = await Pitch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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
  const pitch = await Pitch.findByIdAndUpdate(
    req.params.id,
    {
      status: pitchStatusEnum.APPROVED,
      reviewedBy: req.user._id,
      ...req.body,
    },
    { new: true, runValidators: true },
  ).lean();

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
  const pitch = await Pitch.findByIdAndUpdate(req.params.id, {
    $set: {
      status: pitchStatusEnum.DECLINED,
      reviewedBy: req.user._id,
    },
  }).lean();

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
  const user = await User.findById(req.body.userId);
  if (!user) {
    sendNotFound(res, `User with id ${req.body.userId} not found`);
    return;
  }

  const updatedPitch = await Pitch.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: {
        pendingContributors: {
          userId: req.body.userId,
          teams: req.body.teams,
          message: req.body.message,
          dateSubmitted: new Date(),
          status: pitchStatusEnum.PENDING,
        },
      },
    },
    { new: true, runValidators: true },
  );

  await User.findByIdAndUpdate(user._id, {
    $addToSet: {
      submittedClaims: updatedPitch._id,
    },
  });

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
  const pitch = await Pitch.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        pendingContributors: { userId: userId, teams: teams },
      },
      //TODO: Target in teams should decrease after
      $addToSet: {
        assignmentContributors: { userId: userId, teams: teams },
      },
    },
    { new: true, runValidators: true },
  ).lean();

  // Add the pitch to the user's claimed Pitches
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        claimedPitches: req.params.id,
      },
      $pull: {
        submittedClaims: req.params.id,
      },
    },
    { new: true, returnOriginal: false },
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

  const pitch = await Pitch.findOneAndUpdate(
    { _id: req.params.id, 'pendingContributors.userId': userId },
    {
      $set: {
        'pendingContributors.$.status': pitchStatusEnum.DECLINED,
      },
    },
    { new: true, runValidators: true },
  ).lean();

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const claimUser = await User.findById(userId);
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
  const deletedPitch = await Pitch.findByIdAndDelete(req.params.id);

  if (!deletedPitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  sendSuccess(res, 'Pitch deleted successfully', deletedPitch);
};

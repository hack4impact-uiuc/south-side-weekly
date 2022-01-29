import { Request, Response } from 'express';
import { BasePopulatedPitch } from 'ssw-common';
import {
  sendApprovedPitchMail,
  sendApproveUserMail,
  sendClaimRequestApprovedMail,
  sendClaimRequestDeclinedMail,
  sendContributorAddedToPitchMail,
  sendDeclinedPitchMail,
  sendRejectUserMail,
} from '../mail/sender';
import { populatePitch } from '../populators';
import { PitchService, TeamService, UserService } from '../services';

import { sendSuccess } from '../utils/helpers';

export const sendUserApprovedNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const contributorId: string = req.body.contributorId;
  const reviewerId: string = req.body.reviewerId;

  const contributor = await UserService.getOne(contributorId);
  const reviewer = await UserService.getOne(reviewerId);

  await sendApproveUserMail(contributor, reviewer);
  sendSuccess(res, 'User approved successfully');
};

export const sendUserRejectedNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const contributorId: string = req.body.contributorId;
  const reviewerId: string = req.body.reviewerId;

  const contributor = await UserService.getOne(contributorId);
  const reviewer = await UserService.getOne(reviewerId);

  await sendRejectUserMail(contributor, reviewer);

  sendSuccess(res, 'User rejected successfully');
};

export const sendClaimRequestApprovedNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const contributorId: string = req.body.contributorId;
  const pitchId: string = req.body.pitchId;
  const staffId: string = req.body.staffId;
  const teamId: string = req.body.teamId;

  const contributor = await UserService.getOne(contributorId);

  const pitch = await PitchService.getOne(pitchId);
  const populatedPitch = (await populatePitch(
    pitch,
    'default',
  )) as BasePopulatedPitch;

  const staff = await UserService.getOne(staffId);
  const team = await TeamService.getOne(teamId);

  await sendClaimRequestApprovedMail(contributor, populatedPitch, staff, team);

  sendSuccess(res, 'Claim request approved successfully');
};

export const sendClaimRequestDeclinedNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const contributorId: string = req.body.contributorId;
  const pitchId: string = req.body.pitchId;
  const staffId: string = req.body.staffId;

  const contributor = await UserService.getOne(contributorId);

  const pitch = await PitchService.getOne(pitchId);

  const staff = await UserService.getOne(staffId);

  await sendClaimRequestDeclinedMail(contributor, staff, pitch);

  sendSuccess(res, 'Claim request declined successfully');
};

export const sendPitchApprovedNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const contributorId: string = req.body.contributorId;
  const pitchId: string = req.body.pitchId;
  const reviewerId: string = req.body.reviewerId;

  const contributor = await UserService.getOne(contributorId);

  const pitch = await PitchService.getOne(pitchId);
  const populatedPitch = (await populatePitch(
    pitch,
    'default',
  )) as BasePopulatedPitch;

  const reviewer = await UserService.getOne(reviewerId);

  await sendApprovedPitchMail(
    contributor,
    reviewer,
    populatedPitch,
    pitch.writer === pitch.author,
  );
  sendSuccess(res, 'Pitch approved successfully');
};

export const sendPitchDeclinedNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const contributorId: string = req.body.contributorId;
  const staffId: string = req.body.staffId;
  const pitchId: string = req.body.pitchId;
  const reasoning: string | undefined = req.body.reasoning;

  const contributor = await UserService.getOne(contributorId);
  const staff = await UserService.getOne(staffId);

  const pitch = await PitchService.getOne(pitchId);
  const populatedPitch = (await populatePitch(
    pitch,
    'default',
  )) as BasePopulatedPitch;

  await sendDeclinedPitchMail(contributor, staff, populatedPitch, reasoning);

  sendSuccess(res, 'Pitch declined successfully');
};

export const sendContributorAddedNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const contributorId: string = req.body.contributorId;
  const staffId: string = req.body.staffId;
  const pitchId: string = req.body.pitchId;

  const contributor = await UserService.getOne(contributorId);
  const staff = await UserService.getOne(staffId);

  const pitch = await PitchService.getOne(pitchId);
  const populatedPitch = (await populatePitch(
    pitch,
    'default',
  )) as BasePopulatedPitch;

  await sendContributorAddedToPitchMail(contributor, staff, populatedPitch);

  sendSuccess(res, 'Contributor added successfully');
};

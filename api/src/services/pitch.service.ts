import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IPitch } from 'ssw-common';
import { UserService } from '.';

import Pitch, { PitchSchema } from '../models/pitch';
import { pitchStatusEnum } from '../utils/enums';

type Pitches = Promise<LeanDocument<PitchSchema>[]>;
type Pitch = Promise<LeanDocument<PitchSchema>>;

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: UpdateQuery<T>,
): Pitch =>
  await Pitch.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const isPitchClaimed = (pitch: IPitch): boolean =>
  getOpenTeamsForPitch(pitch).length === 0;

export const getOpenTeamsForPitch = (pitch: IPitch): IPitch['teams'] => {
  let openTeams: IPitch['teams'] = [];
  if (pitch.teams !== null && pitch.teams.length !== undefined) {
    openTeams = pitch.teams.filter((team) => team.target > 0);
  }
  return openTeams;
};

export const add = async (payload: Partial<IPitch>): Pitch => {
  const pitch = await Pitch.create(payload);
  await UserService.addSubmittedPitch(payload._id, pitch._id);

  return pitch;
};

export const getOne = async (_id: string): Pitch =>
  await Pitch.findById({ _id }).lean();

export const getAll = async (): Pitches => await Pitch.find({}).lean();

export const getPendingPitches = async (): Pitches =>
  await Pitch.find({ status: pitchStatusEnum.PENDING }).lean();

export const getApprovedPitches = async (status?: string): Pitches => {
  const pitches = await Pitch.find({ status: pitchStatusEnum.APPROVED }).lean();

  if (!status) {
    return pitches;
  } else if (status === 'unclaimed') {
    return pitches.filter((pitch) => !isPitchClaimed(pitch));
  }

  return pitches.filter(isPitchClaimed);
};

export const getPendingClaimPitches = async (): Pitches =>
  await Pitch.find({
    'pendingContributors.0': { $exists: true },
  });

export const getFeedbackForPitch = async (pitchId: string): Pitches =>
  await Pitch.find({ pitchId }).lean();

export const update = async (_id: string, payload: Partial<IPitch>): Pitch =>
  await updateModel({ _id }, payload);

export const remove = async (_id: string): Pitch =>
  await Pitch.findByIdAndRemove({ _id }).lean();

export const getPitchesInIssue = async (issuePitchIds: string[]): Pitches =>
  await Pitch.find({ _id: { $in: issuePitchIds } }).lean();

export const changeIssueStatus = async (
  _id: string,
  issueId: string,
  issueStatus: string,
): Pitch => {
  await updateModel({ _id }, { $pull: { issueStatuses: { issueId } } });

  return await updateModel(
    { _id },
    {
      $addToSet: {
        issueStatuses: { issueId, issueStatus },
      },
    },
  );
};

export const approvePitch = async (
  _id: string,
  reviewedBy: string,
  payload: Partial<PitchSchema>,
): Pitch =>
  await updateModel(
    { _id },
    { status: pitchStatusEnum.APPROVED, reviewedBy, payload },
  );

export const declinePitch = async (_id: string, reviewedBy: string): Pitch =>
  await updateModel({ _id }, { status: pitchStatusEnum.DECLINED, reviewedBy });

export const submitClaim = async (
  _id: string,
  userId: string,
  teams: string[],
  message: string,
): Pitch =>
  await updateModel(
    { _id },
    {
      $addToSet: {
        pendingContributors: {
          userId,
          teams,
          message,
          dateSubmitted: new Date(),
          status: pitchStatusEnum.PENDING,
        },
      },
    },
  );

export const approveClaimRequest = async (
  _id: string,
  userId: string,
  teams: string[],
): Pitch =>
  await updateModel(
    { _id },
    {
      $pull: {
        pendingContributors: { userId: userId, teams: teams },
      },
      //TODO: Target in teams should decrease after
      $addToSet: {
        assignmentContributors: { userId: userId, teams: teams },
      },
    },
  );

export const declineClaimRequest = async (_id: string, userId: string): Pitch =>
  await updateModel(
    { _id, 'pendingContributors.userId': userId },
    {
      $set: {
        'pendingContributors.$.status': pitchStatusEnum.DECLINED,
      },
    },
  );

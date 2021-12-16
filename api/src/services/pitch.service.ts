import _ from 'lodash';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IPitch } from 'ssw-common';
import { UserService } from '.';

import Pitch, { PitchSchema } from '../models/pitch';
import { pitchStatusEnum } from '../utils/enums';
import { PaginateOptions } from './types';

interface PitchesResponse {
  data: LeanDocument<PitchSchema>[];
  count: number;
}

type Pitch = Promise<LeanDocument<PitchSchema>>;

const paginate = async (
  definedFilters: FilterQuery<PitchSchema>,
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> => {
  const { offset, limit, sort, filters, search } = options || {};
  const mergedFilters = _.merge(filters, definedFilters);

  const pitches = await Pitch.find(mergedFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean();

  const count = await Pitch.countDocuments(mergedFilters);

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    const filteredPitches = pitches.filter((pitch) => {
      const searchableFields = [pitch.title, pitch.description];
      return searchableFields.some(
        (field) => field && field.match(searchRegex),
      );
    });

    return {
      data: filteredPitches,
      count: filteredPitches.length,
    };
  }

  return {
    data: pitches,
    count,
  };
};

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

export const getAll = async (
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> => await paginate({}, options);

export const getPendingPitches = async (
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> =>
  await paginate({ status: pitchStatusEnum.PENDING }, options);

export const getApprovedPitches = async (
  status?: string,
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> => {
  const pitches = await paginate({ status: pitchStatusEnum.APPROVED }, options);

  if (!status) {
    return pitches;
  } else if (status === 'unclaimed') {
    const unclaimedPitches = pitches.data.filter(
      (pitch) => !isPitchClaimed(pitch),
    );
    return { data: unclaimedPitches, count: unclaimedPitches.length };
  }

  const claimedPitches = pitches.data.filter(isPitchClaimed);
  return { data: claimedPitches, count: claimedPitches.length };
};

export const getPendingClaimPitches = async (
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> =>
  await paginate({ 'pendingContributors.0': { $exists: true } }, options);

export const getFeedbackForPitch = async (
  pitchId: string,
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> => await paginate({ _id: pitchId }, options);

export const update = async (_id: string, payload: Partial<IPitch>): Pitch =>
  await updateModel({ _id }, payload);

export const remove = async (_id: string): Pitch =>
  await Pitch.findByIdAndRemove({ _id }).lean();

export const getPitchesInIssue = async (
  issuePitchIds: string[],
): Promise<PitchesResponse> => {
  const pitches = await Pitch.find({
    _id: { $in: issuePitchIds },
  }).lean();

  return { data: pitches, count: pitches.length };
};

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

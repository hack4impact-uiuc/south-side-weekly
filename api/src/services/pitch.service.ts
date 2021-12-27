import _ from 'lodash';
import { Condition } from 'mongodb';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { BasePopulatedUser, IPitch } from 'ssw-common';
import { IssueService, UserService } from '.';

import Pitch, { PitchSchema } from '../models/pitch.model';
import { populateUser } from '../populators';
import { pitchStatusEnum, rolesEnum } from '../utils/enums';
import { PaginateOptions } from './types';

interface PitchesResponse {
  data: LeanDocument<PitchSchema>[];
  count: number;
}

const searchFields = ['title', 'description'];

const ignoreKeys = ['hasPublishDate'];

const mongooseFilters = (
  filters: FilterQuery<PitchSchema>,
): FilterQuery<PitchSchema> => _.omit(filters, ignoreKeys);

const hasPublishDateFilter = (
  hasPublishDate: Condition<string>,
): FilterQuery<PitchSchema> => {
  if (!hasPublishDate) {
    return {};
  }

  hasPublishDate = hasPublishDate.toString().toUpperCase();

  if (hasPublishDate === 'TRUE') {
    return { 'issueStatuses.0': { $exists: true } };
  } else if (hasPublishDate === 'FALSE') {
    return { 'issueStatuses.0': { $exists: false } };
  }
  return {};
};

type Pitch = Promise<LeanDocument<PitchSchema>>;

const paginate = async (
  definedFilters: FilterQuery<PitchSchema>,
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> => {
  const { offset, limit, sort, filters, search } = options || {};
  const mergedFilters = _.merge(
    mongooseFilters(filters),
    definedFilters,
    {
      $or: searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    },
    hasPublishDateFilter(filters['hasPublishDate']),
  );

  const pitches = await Pitch.find(mergedFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean();

  const count = await Pitch.countDocuments(mergedFilters);

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
  await UserService.addSubmittedPitch(payload.author, pitch._id);

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

export const getClaimablePitches = async (
  userId: string,
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> => {
  let pitches = (await getApprovedPitches(null, options)).data;
  const user = ((await populateUser(
    await UserService.getOne(userId),
    'default',
  )) as unknown) as BasePopulatedUser;

  // Remove the pitches that the user created
  pitches = pitches.filter(
    (pitch) => pitch.author.toString() !== user._id.toString(),
  );
  const teamIds = user.teams.map((team) => team._id);
  const isWriter = user.teams.some(
    (team) => team.name.toLowerCase() === 'writing',
  );
  const isEditor = user.teams.some(
    (team) => team.name.toLowerCase() === 'editing',
  );

  const [noWriters, writers] = _.partition(
    pitches,
    (pitch) => pitch.writer === null,
  );

  const isClaimablePitch = (pitch: PitchSchema): boolean => {
    const pitchHasUserTeamWithSpace = teamIds.some((id) =>
      pitch.teams.some(
        (team) => team.teamId.toString() === id.toString() && team.target > 0,
      ),
    );

    const isPrimaryEditorAvailable =
      pitch.primaryEditor === null && user.role === rolesEnum.ADMIN;
    const isSecondsThirdsEditorAvailable =
      (pitch.secondEditors.length < 2 || pitch.thirdEditors.length < 3) &&
      user.role === rolesEnum.STAFF;
    const pitchHasEditorSpace =
      isEditor && (isPrimaryEditorAvailable || isSecondsThirdsEditorAvailable);

    return pitchHasUserTeamWithSpace || pitchHasEditorSpace;
  };

  const claimablePitches = writers.filter(isClaimablePitch);

  // If user is not a writer
  if (isWriter) {
    return {
      data: [...noWriters, ...claimablePitches],
      count: noWriters.length + claimablePitches.length,
    };
  }
  return { data: claimablePitches, count: claimablePitches.length };
};

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
): Pitch => {
  await IssueService.addPitch(
    payload.issueStatuses.map((issue) => issue.issueId),
    _id,
  );

  return await updateModel(
    { _id },
    { status: pitchStatusEnum.APPROVED, reviewedBy, ...payload },
  );
};

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

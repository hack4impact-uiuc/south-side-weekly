import _ from 'lodash';
import { Condition } from 'mongodb';
import { FilterQuery, LeanDocument, UpdateQuery, Types } from 'mongoose';
import { BasePopulatedUser, IPitch } from 'ssw-common';
import { IssueService, UserService } from '.';

import Pitch, { PitchSchema } from '../models/pitch.model';
import { populateUser } from '../populators';
import { pitchStatusEnum } from '../utils/enums';
import { PaginateOptions } from './types';

interface PitchesResponse {
  data: LeanDocument<PitchSchema>[];
  count: number;
}

const ignoreKeys = ['hasPublishDate', 'claimStatus'];

const mongooseFilters = (
  filters: FilterQuery<PitchSchema>,
): FilterQuery<PitchSchema> => _.omit(filters, ignoreKeys);

const claimStatusFilter = (
  status: Condition<string>,
): FilterQuery<PitchSchema> => {
  status = String(status).toLowerCase();
  if (!status || (status !== 'unclaimed' && status !== 'claimed')) {
    return {};
  }

  if (status === 'claimed') {
    return {
      teams: { $not: { $elemMatch: { target: { $gt: 0 } } } },
      writer: { $ne: null },
      primaryEditor: { $ne: null },
      'secondaryEditor.0': { $exists: true },
      'thirdEditors.0': { $exists: true },
    };
  }

  return {
    $or: [
      { writer: { $eq: null } },
      { teams: { $elemMatch: { target: { $gt: 0 } } } },
      { primaryEditor: { $eq: null } },
      { secondEditors: { $eq: [] } },
      { thirdEditors: { $eq: [] } },
    ],
  };
};

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

const claimablePitchesFilter = (
  user: BasePopulatedUser,
): FilterQuery<PitchSchema> => {
  const isWriter = user.teams.some(
    (team) => team.name.toLowerCase() === 'writing',
  );
  const isEditor = user.teams.some(
    (team) => team.name.toLowerCase() === 'editing',
  );

  const editorQuery = isEditor
    ? [
        { secondEditors: { $eq: Array<undefined>() } },
        { thirdEditors: { $eq: Array<undefined>() } },
      ]
    : [];

  if (!isWriter) {
    return {
      author: { $eq: user._id },
      status: { $eq: pitchStatusEnum.APPROVED },
      writer: { $ne: null },
      $or: [
        {
          teams: {
            $elemMatch: {
              target: { $gt: 0 },
              teamId: { $in: user.teams.map((team) => team._id) },
            },
          },
        },
        ...editorQuery,
      ],
    };
  }

  return {
    $and: [
      { author: { $eq: user._id } },
      { status: { $eq: pitchStatusEnum.APPROVED } },
    ],
    $or: [
      { writer: { $eq: null } },
      {
        teams: {
          $elemMatch: {
            target: { $gt: 0 },
            teamId: { $in: user.teams.map((team) => team._id) },
          },
        },
      },
      ...editorQuery,
    ],
  };
};

const searchFilter = (search: string): FilterQuery<PitchSchema> => {
  if (!search || search === '') {
    return {};
  }

  search = search.trim();

  const regexMatch = (field: string): Condition<any> => ({
    $regexMatch: {
      input: field,
      regex: search,
      options: 'i',
    },
  });

  return {
    $expr: {
      $or: [regexMatch('$title'), regexMatch('$description')],
    },
  };
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
    hasPublishDateFilter(filters['hasPublishDate']),
    claimStatusFilter(filters['claimStatus']),
    searchFilter(search),
  );

  console.log('Pitch doc filters: ');
  console.log(mergedFilters);
  console.log(mergedFilters.$or);

  const pitches = await Pitch.find(mergedFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .collation({ locale: 'en' })
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
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> =>
  await paginate({ status: pitchStatusEnum.APPROVED }, options);

export const getPendingClaimPitches = async (
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> =>
  await paginate({ 'pendingContributors.0': { $exists: true } }, options);

export const getClaimablePitches = async (
  userId: string,
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> => {
  const user = await UserService.getOne(userId);
  const pUser = (await populateUser(user, 'default')) as any;

  return await paginate(claimablePitchesFilter(pUser), options);
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

export const getMemberPitches = async (
  _id: string,
  options?: PaginateOptions<PitchSchema>,
): Promise<{
  data: LeanDocument<PitchSchema>[];
  count: number;
}> => {
  const filteredPitches = await paginate(
    {
      $or: [
        {
          author: _id,
        },
        { writer: _id },
        {
          'assignmentContributors.userId': Types.ObjectId(_id),
        },
        { primaryEditor: _id },
        { secondEditors: _id },
        { thirdEditors: _id },
      ],
    },
    options,
  );

  return filteredPitches;
};

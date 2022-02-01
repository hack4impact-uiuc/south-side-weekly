import _ from 'lodash';
import { Condition } from 'mongodb';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { BasePopulatedUser, IPitch, Pitch as PitchType } from 'ssw-common';
import { IssueService, UserService } from '.';

import Pitch, { PitchSchema } from '../models/pitch.model';
import { populateUser } from '../populators';
import {
  issueStatusEnum,
  pitchStatusEnum,
  editorTypeEnum,
} from '../utils/enums';
import { PaginateOptions } from './types';

interface PitchesResponse {
  data: LeanDocument<PitchSchema>[];
  count: number;
}

const ignoreKeys = [
  'hasPublishDate',
  'claimStatus',
  'isPublished',
  'isFullyPublished',
];

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
      { secondEditors: { $eq: [] as any[] } },
      { thirdEditors: { $eq: [] as any[] } },
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

const isPublishedFilter = (
  isPublished: Condition<string>,
): FilterQuery<PitchSchema> => {
  if (!isPublished) {
    return {};
  }

  isPublished = isPublished.toString().toUpperCase();

  const publishedCondition = {
    $elemMatch: {
      issueStatus: issueStatusEnum.READY_TO_PUBLISH,
      releaseDate: { $lt: new Date() },
    },
  };

  if (isPublished === 'TRUE') {
    return {
      issueStatuses: {
        ...publishedCondition,
      },
    };
  } else if (isPublished === 'FALSE') {
    return {
      issueStatuses: {
        $not: {
          ...publishedCondition,
        },
      },
    };
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
        { secondEditors: { $eq: [] as any[] } },
        { thirdEditors: { $eq: [] as any[] } },
      ]
    : [];

  if (!isWriter) {
    return {
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
    status: { $eq: pitchStatusEnum.APPROVED },
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

export type Pitch = Promise<LeanDocument<PitchSchema>>;

const paginate = async (
  definedFilters: FilterQuery<PitchSchema>,
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> => {
  const { offset, limit, sort, filters, search } = options || {};
  const mergedFilters = _.merge(
    mongooseFilters(filters),
    definedFilters,
    hasPublishDateFilter(filters['hasPublishDate']),
    isPublishedFilter(filters['isPublished']),
    claimStatusFilter(filters['claimStatus']),
    searchFilter(search),
  );

  console.log(mongooseFilters(filters));
  console.log(mergedFilters);

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
  await Pitch.findOneAndUpdate(filters, payload, {
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

export const add = async (payload: Partial<PitchType>): Pitch => {
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

export const getClaimRequests = async (
  userId: string,
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> =>
  await paginate(
    {
      pendingContributors: {
        $elemMatch: {
          userId,
        },
      },
    },
    options,
  );

export const getFeedbackForPitch = async (
  pitchId: string,
  options?: PaginateOptions<PitchSchema>,
): Promise<PitchesResponse> => await paginate({ _id: pitchId }, options);

export const update = async (_id: string, payload: Partial<PitchType>): Pitch =>
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
  releaseDate: string,
): Pitch => {
  await updateModel({ _id }, { $pull: { issueStatuses: { issueId } } });

  return await updateModel(
    { _id },
    {
      $addToSet: {
        issueStatuses: { issueId, issueStatus, releaseDate: releaseDate },
      },
    },
  );
};

export const approvePitch = async (
  _id: string,
  reviewedBy: string,
  payload: Partial<PitchSchema>,
): Pitch => {
  await IssueService.addPitchToIssues(
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

export const addContributorToAssignmentContributors = async (
  _id: string,
  userId: string,
  teamId: string,
): Pitch => {
  const pitchWithUser = await Pitch.findOne({
    _id: _id,
    'assignmentContributors.userId': userId,
  });

  let pitch;

  if (pitchWithUser) {
    pitch = await updateModel(
      { _id: _id, 'assignmentContributors.userId': userId },
      {
        $addToSet: {
          'assignmentContributors.$.teams': teamId,
        },
      },
    );
  } else {
    pitch = await updateModel(
      { _id },
      {
        $addToSet: {
          assignmentContributors: { userId: userId, teams: [teamId] },
        },
      },
    );
  }

  return pitch;
};

export const removeTeamFromPendingContributors = async (
  id: string,
  userId: string,
  teamId: string,
): Pitch => {
  const pitch = await updateModel(
    { _id: id, 'pendingContributors.userId': userId },
    {
      $pull: {
        'pendingContributors.$.teams': teamId,
      },
    },
  );
  await removeEmptyPendingContributors(id);
  return pitch;
};

export const removeEmptyPendingContributors = async (
  id: string,
): Promise<void> => {
  await updateModel(
    { _id: id },
    {
      $pull: {
        pendingContributors: { teams: [] },
      },
    },
  );
};

export const removeEmptyAssignmentContributors = async (
  id: string,
): Promise<void> => {
  await updateModel(
    { _id: id },
    {
      $pull: {
        assignmentContributors: { teams: [] },
      },
    },
  );
};

export const updateTeamTarget = async (
  _id: string,
  teamId: string,
  target: number,
): Pitch => {
  let updatedPitch = await updateModel(
    { _id: _id, 'teams.teamId': teamId },
    { 'teams.$.target': target },
  );
  if (!updatedPitch) {
    updatedPitch = await updateModel(
      { _id: _id },
      { $addToSet: { teams: { teamId: teamId, target: target } } },
    );
  }

  return updatedPitch;
};

export const decrementTeamTarget = async (
  _id: string,
  teamId: string,
): Pitch => {
  const pitchWithTeam = await Pitch.findOne({
    _id: _id,
    'teams.teamId': teamId,
  });

  let pitch;

  if (pitchWithTeam) {
    pitch = await updateModel(
      {
        _id: _id,
        'teams.teamId': teamId,
        'teams.target': { $gt: 0 },
      },
      {
        $inc: {
          'teams.$.target': -1,
        },
      },
    );
  } else {
    pitch = await updateModel(
      { _id },
      {
        $addToSet: {
          teams: { teamId: teamId, target: 0 },
        },
      },
    );
  }

  return pitch;
};

export const incrementTeamTarget = async (_id: string, teamId: string): Pitch =>
  await updateModel(
    {
      _id: _id,
      'teams.teamId': teamId,
    },
    {
      $inc: {
        'teams.$.target': 1,
      },
    },
  );

export const changeEditor = async (
  _id: string,
  userId: string,
  from: string,
  to: string,
): Pitch => {
  let pitch;

  if (from === editorTypeEnum.PRIMARY) {
    pitch = await updateModel(
      { _id },
      {
        primaryEditor: null,
        $addToSet: {
          ...(to === editorTypeEnum.SECONDS
            ? { secondEditors: userId }
            : { thirdEditors: userId }),
        },
      },
    );
  } else if (to === editorTypeEnum.PRIMARY) {
    pitch = await updateModel(
      { _id },
      {
        primaryEditor: userId,
        $pull: {
          ...(from === editorTypeEnum.SECONDS
            ? { secondEditors: userId }
            : { thirdEditors: userId }),
        },
      },
    );
  } else if (
    from === editorTypeEnum.SECONDS ||
    from === editorTypeEnum.THIRDS
  ) {
    pitch = updateModel(
      { _id },
      {
        $pull: {
          ...(from === editorTypeEnum.SECONDS
            ? { secondEditors: userId }
            : { thirdEditors: userId }),
        },
        $addToSet: {
          ...(to === editorTypeEnum.SECONDS
            ? { secondEditors: userId }
            : { thirdEditors: userId }),
        },
      },
    );
  }

  return pitch;
};

export const addContributor = async (
  _id: string,
  userId: string,
  teamId: string,
  editor: string | undefined,
  writer: string,
): Pitch => {
  let pitch;
  if (editor === editorTypeEnum.PRIMARY) {
    pitch = await updateModel(
      { _id },
      {
        primaryEditor: userId,
      },
    );
  } else if (
    editor === editorTypeEnum.SECONDS ||
    editor === editorTypeEnum.THIRDS
  ) {
    pitch = updateModel(
      { _id },
      {
        $addToSet: {
          ...(editor === editorTypeEnum.SECONDS
            ? { secondEditors: userId }
            : { thirdEditors: userId }),
        },
      },
    );
  } else if (writer === 'true') {
    pitch = updateModel(
      { _id },
      {
        writer: userId,
      },
    );
  } else {
    pitch = await addContributorToAssignmentContributors(_id, userId, teamId);
  }

  return pitch;
};

export const removeContributor = async (
  _id: string,
  userId: string,
  teamId: string,
  editor: string | undefined,
  writer: string,
): Pitch => {
  let pitch;

  if (editor === editorTypeEnum.PRIMARY) {
    pitch = await updateModel(
      { _id },
      {
        primaryEditor: null,
      },
    );
  } else if (
    editor === editorTypeEnum.SECONDS ||
    editor === editorTypeEnum.THIRDS
  ) {
    pitch = await updateModel(
      { _id },
      {
        $pull: {
          ...(editor === editorTypeEnum.SECONDS
            ? { secondEditors: userId }
            : { thirdEditors: userId }),
        },
      },
    );
  } else if (writer === 'true') {
    pitch = await updateModel(
      { _id },
      {
        writer: null,
      },
    );
  } else {
    pitch = await updateModel(
      { _id: _id, 'assignmentContributors.userId': userId },
      {
        $pull: {
          'assignmentContributors.$.teams': teamId,
        },
      },
    );
  }

  await removeEmptyAssignmentContributors(_id);

  return pitch;
};

const userOnPitchFilters = (userId: string): FilterQuery<PitchSchema> => ({
  $or: [
    {
      author: userId,
    },
    { writer: userId },
    { assignmentContributors: { $elemMatch: { userId: userId } } },
    { primaryEditor: userId },
    { secondEditors: userId },
    { thirdEditors: userId },
  ],
});

export const getCurrentPitches = async (
  _id: string,
  options?: PaginateOptions<PitchSchema>,
): Promise<{
  data: LeanDocument<PitchSchema>[];
  count: number;
}> => {
  const filteredPitches = await paginate(
    {
      status: pitchStatusEnum.APPROVED,
      issueStatuses: {
        $elemMatch: {
          issueStatus: {
            $ne: issueStatusEnum.READY_TO_PUBLISH,
          },
          releaseDate: { $gte: new Date().getTime() },
        },
      },

      // }
      // $not: { $elemMatch: { releaseDate: { $lt: new Date().getUTCDate() } } },

      ...userOnPitchFilters(_id),
    },
    options,
  );

  return filteredPitches;
};

export const getAllUserPitches = async (
  userId: string,
  options?: PaginateOptions<PitchSchema>,
): Promise<{
  data: LeanDocument<PitchSchema>[];
  count: number;
}> => await paginate({ ...userOnPitchFilters(userId) }, options);

export const isWriterOrEditor = (writer: string, editor: string): boolean =>
  editor === editorTypeEnum.PRIMARY ||
  editor === editorTypeEnum.SECONDS ||
  editor === editorTypeEnum.THIRDS ||
  writer === 'true';

export const isPendingContributor = (
  pitchId: string,
  userId: string,
  teamId: string,
): Promise<boolean> =>
  Pitch.exists({
    _id: pitchId,
    pendingContributors: {
      $elemMatch: {
        userId,
        teams: teamId,
      },
    },
  });

export const isContributor = (
  pitchId: string,
  userId: string,
  teamId: string,
): Promise<boolean> =>
  Pitch.exists({
    _id: pitchId,
    assignmentContributors: {
      $elemMatch: {
        userId,
        teams: teamId,
      },
    },
  });

export const duplicatePitch = async (
  authorId: string,
  title: string,
): Promise<boolean> => Pitch.exists({ author: authorId, title });

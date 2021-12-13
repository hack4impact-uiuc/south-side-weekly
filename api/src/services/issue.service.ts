import _ from 'lodash';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IIssue, IPitch } from 'ssw-common';
import { PitchService } from '.';

import Issue, { IssueSchema } from '../models/issue';
import { PitchSchema } from '../models/pitch';
import { issueStatusEnum } from '../utils/enums';
import { PaginateOptions } from './types';

interface IssuesResponse {
  data: LeanDocument<IssueSchema>[];
  count: number;
}

type Issue = Promise<LeanDocument<IssueSchema>>;

const paginate = async (
  definedFilters: FilterQuery<IssueSchema>,
  options?: PaginateOptions<IssueSchema>,
): Promise<IssuesResponse> => {
  const { offset, limit, sort, filters } = options || {};
  const mergedFilters = _.merge(filters, definedFilters);

  const users = await Issue.find(mergedFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean();

  const count = await Issue.countDocuments(mergedFilters);

  return {
    data: users,
    count,
  };
};

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: UpdateQuery<T>,
): Issue =>
  await Issue.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const add = async (payload: Partial<IIssue>): Issue => {
  const feedback = await Issue.create(payload);
  return await getOne(feedback._id);
};

export const getOne = async (_id: string): Issue =>
  await Issue.findById({ _id }).lean();

export const getAll = async (
  options?: PaginateOptions<IssueSchema>,
): Promise<IssuesResponse> => await paginate({}, options);

export const getFeedbackForPitch = async (
  pitchId: string,
  options: PaginateOptions<IssueSchema>,
): Promise<IssuesResponse> => await paginate({ pitchId }, options);

export const update = async (_id: string, payload: Partial<IIssue>): Issue =>
  await updateModel({ _id }, payload);

export const remove = async (_id: string): Issue =>
  await Issue.findByIdAndRemove({ _id }).lean();

const isPitchInStatusBucket = (
  statuses: IPitch['issueStatuses'],
  issueStatus: string,
  issueId: string,
): boolean =>
  statuses.some(
    (status) =>
      status.issueId.toString() === issueId &&
      status.issueStatus === issueStatus,
  );

interface Bucket {
  status: string;
  pitches: LeanDocument<PitchSchema>[];
}

export const getPitchBuckets = async (
  issue: IssueSchema,
): Promise<Bucket[]> => {
  const buckets: Bucket[] = [];

  const pitches = await PitchService.getPitchesInIssue(issue.pitches);
  const issueId = issue._id.toString();

  Object.keys(issueStatusEnum).forEach((status) => {
    const bucket = pitches.data.filter((pitch) =>
      isPitchInStatusBucket(pitch.issueStatuses, status, issueId),
    );
    buckets.push({ status: status, pitches: bucket });
  });

  return buckets;
};

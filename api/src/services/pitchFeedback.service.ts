import _ from 'lodash';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IPitchFeedback } from 'ssw-common';

import PitchFeedback, { PitchFeedbackSchema } from '../models/pitchFeedback';
import { PaginateOptions } from './types';

interface PitchFeedbacksResponse {
  data: LeanDocument<PitchFeedbackSchema>[];
  count: number;
}
type PitchFeedback = Promise<LeanDocument<PitchFeedbackSchema>>;

const paginate = async (
  definedFilters: FilterQuery<PitchFeedbackSchema>,
  options?: PaginateOptions<PitchFeedbackSchema>,
): Promise<PitchFeedbacksResponse> => {
  const { offset, limit, sort, filters } = options || {};
  const mergedFilters = _.merge(filters, definedFilters);

  const users = await PitchFeedback.find(mergedFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean();

  const count = await PitchFeedback.countDocuments(mergedFilters);

  return {
    data: users,
    count,
  };
};

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: UpdateQuery<T>,
): PitchFeedback =>
  await PitchFeedback.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const add = async (payload: Partial<IPitchFeedback>): PitchFeedback => {
  const feedback = await PitchFeedback.create(payload);
  return await getOne(feedback._id);
};

export const getOne = async (_id: string): PitchFeedback =>
  await PitchFeedback.findById({ _id }).lean();

export const getAll = async (
  options?: PaginateOptions<PitchFeedbackSchema>,
): Promise<PitchFeedbacksResponse> => await paginate({}, options);

export const getFeedbackForPitch = async (
  pitchId: string,
  options?: PaginateOptions<PitchFeedbackSchema>,
): Promise<PitchFeedbacksResponse> => await paginate({ pitchId }, options);

export const update = async (
  _id: string,
  payload: Partial<IPitchFeedback>,
): PitchFeedback => await updateModel({ _id }, payload);

export const remove = async (_id: string): PitchFeedback =>
  await PitchFeedback.findByIdAndRemove({ _id }).lean();

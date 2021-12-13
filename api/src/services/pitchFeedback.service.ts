import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IPitchFeedback } from 'ssw-common';

import PitchFeedback, { PitchFeedbackSchema } from '../models/pitchFeedback';
import { PaginateOptions } from './types';
import { mergeFilters } from './utils';

interface PitchFeedbacksResponse {
  data: LeanDocument<PitchFeedbackSchema>[];
  count: number;
}
type PitchFeedback = Promise<LeanDocument<PitchFeedbackSchema>>;

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
): Promise<PitchFeedbacksResponse> => {
  const { offset, limit, sort, filters } = options;

  const allFilters = mergeFilters<PitchFeedbackSchema>(filters, {});
  const count = await PitchFeedback.countDocuments(allFilters);

  const data = await PitchFeedback.find(allFilters)
    .find(allFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean();

  return { data, count };
};

export const getFeedbackForPitch = async (
  pitchId: string,
  options?: PaginateOptions<PitchFeedbackSchema>,
): Promise<PitchFeedbacksResponse> => {
  const { offset, limit, sort, filters } = options;

  const allFilters = mergeFilters<PitchFeedbackSchema>(filters, { pitchId });
  const count = await PitchFeedback.countDocuments(allFilters);

  const data = await PitchFeedback.find(allFilters)
    .find(allFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean();

  return { data, count };
};

export const update = async (
  _id: string,
  payload: Partial<IPitchFeedback>,
): PitchFeedback => await updateModel({ _id }, payload);

export const remove = async (_id: string): PitchFeedback =>
  await PitchFeedback.findByIdAndRemove({ _id }).lean();

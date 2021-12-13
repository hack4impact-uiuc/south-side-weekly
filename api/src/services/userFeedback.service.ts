import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IUserFeedback } from 'ssw-common';

import UserFeedback, { UserFeedbackSchema } from '../models/userFeedback';
import { PaginateOptions } from './types';
import { mergeFilters } from './utils';

type UserFeedback = Promise<LeanDocument<UserFeedbackSchema>>;

interface UserFeedbacksResponse {
  data: LeanDocument<UserFeedbackSchema>[];
  count: number;
}

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: UpdateQuery<T>,
): UserFeedback =>
  await UserFeedback.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const add = async (payload: Partial<IUserFeedback>): UserFeedback =>
  await UserFeedback.create(payload);

export const getOne = async (_id: string): UserFeedback =>
  await UserFeedback.findById({ _id }).lean();

export const getAll = async (
  options?: PaginateOptions<UserFeedbackSchema>,
): Promise<UserFeedbacksResponse> => {
  const { offset, limit, sort, filters } = options;

  const allFilters = mergeFilters<UserFeedbackSchema>(filters, {});
  const count = await UserFeedback.countDocuments(allFilters);

  const data = await UserFeedback.find(allFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean();

  return { data, count };
};

export const update = async (
  _id: string,
  payload: Partial<IUserFeedback>,
): UserFeedback => await updateModel({ _id }, payload);

export const remove = async (_id: string): UserFeedback =>
  await UserFeedback.findByIdAndRemove({ _id }).lean();

export const getAllFeedbackForUser = async (
  userId: string,
  options?: PaginateOptions<UserFeedbackSchema>,
): Promise<UserFeedbacksResponse> => {
  const { offset, limit, sort, filters } = options;

  const allFilters = mergeFilters<UserFeedbackSchema>(filters, { userId });
  const count = await UserFeedback.countDocuments(allFilters);

  const data = await UserFeedback.find(allFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean();

  return { data, count };
};

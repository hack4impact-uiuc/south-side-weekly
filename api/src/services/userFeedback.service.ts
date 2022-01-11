import _ from 'lodash';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IUserFeedback } from 'ssw-common';

import UserFeedback, { UserFeedbackSchema } from '../models/userFeedback.model';
import { PaginateOptions } from './types';

type UserFeedback = Promise<LeanDocument<UserFeedbackSchema>>;

interface UserFeedbacksResponse {
  data: LeanDocument<UserFeedbackSchema>[];
  count: number;
}

const paginate = async (
  definedFilters: FilterQuery<UserFeedbackSchema>,
  options?: PaginateOptions<UserFeedbackSchema>,
): Promise<UserFeedbacksResponse> => {
  const { offset, limit, sort, filters } = options || {};
  const mergedFilters = _.merge(filters, definedFilters);

  const users = await UserFeedback.find(mergedFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean();

  const count = await UserFeedback.countDocuments(mergedFilters);

  return {
    data: users,
    count,
  };
};

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
): Promise<UserFeedbacksResponse> => paginate({}, options);

export const update = async (
  _id: string,
  payload: Partial<IUserFeedback>,
): UserFeedback => await updateModel({ _id }, payload);

export const remove = async (_id: string): UserFeedback =>
  await UserFeedback.findByIdAndRemove({ _id }).lean();

export const getAllFeedbackForUser = async (
  userId: string,
  options?: PaginateOptions<UserFeedbackSchema>,
): Promise<UserFeedbacksResponse> => paginate({ userId }, options);

export const getUserFeedbackForPitch = async (
  userId: string,
  pitchId: string,
  teamId: string,
): UserFeedback =>
  await UserFeedback.findOne({
    userId: userId,
    pitchId: pitchId,
    teamId: teamId,
  });

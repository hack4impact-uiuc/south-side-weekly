import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IUserFeedback } from 'ssw-common';

import UserFeedback, { UserFeedbackSchema } from '../models/userFeedback';

type UserFeedbacks = Promise<LeanDocument<UserFeedbackSchema>[]>;
type UserFeedback = Promise<LeanDocument<UserFeedbackSchema>>;

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

export const getAll = async (): UserFeedbacks =>
  await UserFeedback.find({}).lean();

export const update = async (
  _id: string,
  payload: Partial<IUserFeedback>,
): UserFeedback => await updateModel({ _id }, payload);

export const remove = async (_id: string): UserFeedback =>
  await UserFeedback.findByIdAndRemove({ _id }).lean();

export const getAllFeedbackForUser = async (userId: string): UserFeedbacks =>
  await UserFeedback.find({ userId }).lean();

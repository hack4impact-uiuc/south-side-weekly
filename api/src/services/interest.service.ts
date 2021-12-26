import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IInterest } from 'ssw-common';

import Interest, { InterestSchema } from '../models/interest.model';

type Interests = Promise<LeanDocument<InterestSchema>[]>;
type Interest = Promise<LeanDocument<InterestSchema>>;

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: UpdateQuery<T>,
): Interest =>
  await Interest.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const add = async (payload: Partial<IInterest>): Interest =>
  await Interest.create(payload);

export const addMany = async (payload: Partial<IInterest>[]): Interests =>
  await Interest.insertMany(payload);

export const getOne = async (_id: string): Interest =>
  await Interest.findById({ _id }).lean();

export const getAll = async (): Interests => await Interest.find({}).lean();

export const update = async (
  _id: string,
  payload: Partial<IInterest>,
): Interest => await updateModel({ _id }, payload);

export const updateMany = async (payloads: Partial<IInterest>[]): Interests =>
  await Promise.all(
    payloads.map((payload) => updateModel({ _id: payload._id }, payload)),
  );

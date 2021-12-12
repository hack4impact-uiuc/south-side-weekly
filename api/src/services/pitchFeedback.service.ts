import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IPitchFeedback } from 'ssw-common';

import PitchFeedback, { PitchFeedbackSchema } from '../models/pitchFeedback';

type PitchFeedbacks = Promise<LeanDocument<PitchFeedbackSchema>[]>;
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

export const getAll = async (): PitchFeedbacks =>
  await PitchFeedback.find({}).lean();

export const getFeedbackForPitch = async (pitchId: string): PitchFeedbacks =>
  await PitchFeedback.find({ pitchId }).lean();

export const update = async (
  _id: string,
  payload: Partial<IPitchFeedback>,
): PitchFeedback => await updateModel({ _id }, payload);

export const remove = async (_id: string): PitchFeedback =>
  await PitchFeedback.findByIdAndRemove({ _id }).lean();

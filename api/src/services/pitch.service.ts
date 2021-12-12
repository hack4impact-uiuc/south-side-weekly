import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IPitch } from 'ssw-common';

import Pitch, { PitchSchema } from '../models/pitch';

type Pitches = Promise<LeanDocument<PitchSchema>[]>;
type Pitch = Promise<LeanDocument<PitchSchema>>;

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: UpdateQuery<T>,
): Pitch =>
  await Pitch.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const add = async (payload: Partial<IPitch>): Pitch => {
  const feedback = await Pitch.create(payload);
  return await getOne(feedback._id);
};

export const getOne = async (_id: string): Pitch =>
  await Pitch.findById({ _id }).lean();

export const getAll = async (): Pitches => await Pitch.find({}).lean();

export const getFeedbackForPitch = async (pitchId: string): Pitches =>
  await Pitch.find({ pitchId }).lean();

export const update = async (_id: string, payload: Partial<IPitch>): Pitch =>
  await updateModel({ _id }, payload);

export const remove = async (_id: string): Pitch =>
  await Pitch.findByIdAndRemove({ _id }).lean();

export const getPitchesInIssue = async (issuePitchIds: string[]): Pitches =>
  await Pitch.find({ _id: { $in: issuePitchIds } }).lean();

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

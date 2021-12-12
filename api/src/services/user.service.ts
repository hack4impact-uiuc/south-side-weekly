import { FilterQuery, LeanDocument } from 'mongoose';
import { IUser } from 'ssw-common';

import User, { UserSchema } from '../models/user';
import { onboardingStatusEnum } from '../utils/enums';

type Users = Promise<LeanDocument<UserSchema>[]>;
type User = Promise<LeanDocument<UserSchema>>;

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: Partial<T>,
): User =>
  await User.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const getAll = async (): Users => await User.find({}).lean();

export const getOne = async (id: string): User =>
  await User.findById({ _id: id }).lean();

export const add = async (payload: Partial<IUser>): User =>
  await User.create(payload);

export const stall = async (stallDate: Date): Promise<void> => {
  await User.updateMany(
    {
      dateJoined: { $lt: stallDate },
      onboardingStatus: onboardingStatusEnum.ONBOARDING_SCHEDULED,
    },
    {
      $set: {
        onboardingStatus: onboardingStatusEnum.STALLED,
      },
    },
  );
};

export const getWithOnboardStatus = async (...status: string[]): Users =>
  await User.find({
    onboardingStatus: { $in: status },
  }).lean();

export const update = async (_id: string, payload: Partial<IUser>): User =>
  await updateModel({ _id }, payload);

export const markPageVisited = async (_id: string, page: string): User =>
  await updateModel({ _id }, { $addToSet: { visitedPages: page } });

export const setOnboardStatus = async (_id: string, status: string): User =>
  await updateModel({ _id }, { onboardingStatus: status });

export const addClaimedPitch = async (_id: string, pitchId: string): User =>
  await updateModel(
    { _id },
    { $addToSet: { claimedPitches: pitchId }, lastActive: new Date() },
  );

export const remove = async (_id: string): User =>
  await User.findByIdAndDelete({ _id }).lean();

export const addFeedback = async (_id: string, feedbackId: string): User =>
  await updateModel({ _id }, { $addToSet: { feedback: feedbackId } });

export const removeFeedback = async (_id: string, feedbackId: string): User =>
  await updateModel({ _id }, { $pull: { feedback: feedbackId } });

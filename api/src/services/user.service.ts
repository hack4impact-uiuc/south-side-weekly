import { FilterQuery, LeanDocument } from 'mongoose';
import { IUser } from 'ssw-common';
import User, { UserSchema } from '../models/user';
import { onboardingStatusEnum } from '../utils/enums';

type Users = Promise<LeanDocument<UserSchema>[]>;
type User = Promise<LeanDocument<UserSchema>>;

const updateModel = async <T>(filters: FilterQuery<T>, payload: Partial<T>): User =>
  await User.findOneAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const getUsers = async (): Users => await User.find({}).lean();

export const getUserById = async (id: string): User =>
  await User.findOne({ _id: id }).lean();

export const addUser = async (fields: Partial<IUser>): User =>
  await new User(fields).save();

export const stallUsers = async (stallDate: Date): Promise<void> => {
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

export const getUsersWithOnboardStatus = async (...status: string[]): Users =>
  await User.find({
    onboardingStatus: { $in: status },
  }).lean();

export const updateUser = async (_id: string, payload: Partial<IUser>): User =>
  await updateModel({ _id }, payload);

export const markPageVisited = async (_id: string, page: string): User =>
  await updateModel({ _id }, { $addToSet: { visitedPages: page } });

export const setUserOnboardingStatus = async (
  _id: string,
  status: string,
): User => await updateModel({ _id }, { onboardingStatus: status });

export const addClaimedPitch = async (_id: string, pitchId: string): User =>
  await updateModel(
    { _id },
    { $addToSet: { claimedPitches: pitchId }, lastActive: new Date() },
  );

export const deleteUser = async (_id: string): User =>
  await User.findOneAndDelete({ _id }).lean();

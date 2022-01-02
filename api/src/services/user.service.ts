import _ from 'lodash';
import { Condition } from 'mongodb';
import { FilterQuery, LeanDocument } from 'mongoose';
import { IUser } from 'ssw-common';

import User, { UserSchema } from '../models/user.model';
import { UserFeedbackSchema } from '../models/userFeedback.model';
import { onboardingStatusEnum } from '../utils/enums';
import { PaginateOptions } from './types';

type User = LeanDocument<UserSchema>;

interface UsersResponse {
  data: LeanDocument<UserSchema>[];
  count: number;
}

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: Partial<T>,
): Promise<User> =>
  await User.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean({ virtuals: true });

const searchFields = ['firstName', 'lastName', 'preferredName', 'email'];

const ignoreKeys = ['activityStatus'];

const mongooseFilters = (
  filters: FilterQuery<UserSchema>,
): FilterQuery<UserSchema> => _.omit(filters, ignoreKeys);

const activityFilter = (status: Condition<string>): FilterQuery<UserSchema> => {
  if (!status) {
    return {};
  }

  status = status.toString().toUpperCase();
  const now = new Date();
  const lastActive = new Date(
    now.getFullYear(),
    now.getMonth() - 3,
    now.getDate(),
  );
  const lastRecentlyActive = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
  );
  const lastInactive = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (status === 'ACTIVE') {
    return {
      lastActive: {
        $gte: lastActive,
      },
    };
  } else if (status === 'RECENTLY ACTIVE') {
    return {
      lastActive: {
        $lt: lastActive,
        $gte: lastRecentlyActive,
      },
    };
  } else if (status === 'INACTIVE') {
    return {
      lastActive: {
        $lt: lastInactive,
      },
    };
  }
  return {};
};

const paginate = async (
  definedFilters: FilterQuery<UserSchema>,
  options?: PaginateOptions<UserSchema>,
): Promise<UsersResponse> => {
  const { offset, limit, sort, filters, search } = options || {};
  const mergedFilters = _.merge(
    mongooseFilters(filters),
    definedFilters,
    {
      $or: searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    },
    activityFilter(filters['activityStatus']),
  );

  const users = await User.find(mergedFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .lean({ virtuals: true });

  const count = await User.countDocuments(mergedFilters);

  return {
    data: users,
    count,
  };
};

export const isValidId = async (_id: string): Promise<boolean> =>
  await User.exists({ _id });

export const getAll = async (
  options?: PaginateOptions<UserSchema>,
): Promise<UsersResponse> => paginate({}, options);

export const getOne = async (id: string): Promise<User> =>
  await User.findById({ _id: id }).lean({ virtuals: true });

export const add = async (payload: Partial<IUser>): Promise<User> =>
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

export const getWithOnboardStatus = async (
  status: string[],
  options?: PaginateOptions<UserSchema>,
): Promise<UsersResponse> =>
  paginate({ onboardingStatus: { $in: status } }, options);

export const update = async (
  _id: string,
  payload: Partial<IUser>,
): Promise<User> => await updateModel({ _id }, payload);

export const markPageVisited = async (
  _id: string,
  page: string,
): Promise<User> =>
  await updateModel({ _id }, { $addToSet: { visitedPages: page } });

export const setOnboardStatus = async (
  _id: string,
  status: string,
): Promise<User> => await updateModel({ _id }, { onboardingStatus: status });

export const addClaimedPitch = async (
  _id: string,
  pitchId: string,
): Promise<User> =>
  await updateModel(
    { _id },
    { $addToSet: { claimedPitches: pitchId }, lastActive: new Date() },
  );

export const addSubmittedPitch = async (
  _id: string,
  pitchId: string,
): Promise<User> =>
  await updateModel(
    { _id },
    { $addToSet: { submittedPitches: pitchId }, lastActive: new Date() },
  );

export const addClaimRequest = async (
  _id: string,
  pitchId: string,
): Promise<User> =>
  await updateModel(
    { _id },
    {
      $addToSet: {
        submittedClaims: pitchId,
      },
    },
  );

export const receiveClaimRequestApproval = async (
  _id: string,
  pitchId: string,
): Promise<User> =>
  await updateModel(
    { _id },
    {
      $addToSet: {
        claimedPitches: pitchId,
      },
      $pull: {
        submittedClaims: pitchId,
      },
    },
  );

export const removeClaimedPitch = async (
  _id: string,
  pitchId: string,
): Promise<User> =>
  await updateModel(
    { _id },
    {
      $pull: {
        claimedPitches: pitchId,
      },
    },
  );

export const removeClaimRequest = async (
  _id: string,
  pitchId: string,
): Promise<User> =>
  await updateModel(
    { _id },
    {
      $pull: {
        submittedClaims: pitchId,
      },
    },
  );

export const remove = async (_id: string): Promise<User> =>
  await User.findByIdAndDelete({ _id }).lean({ virtuals: true });

export const addFeedback = async (
  _id: string,
  feedback: LeanDocument<UserFeedbackSchema>,
): Promise<User> => {
  const user = await updateModel(
    { _id },
    { $addToSet: { feedback: feedback._id } },
  );

  if (!user) {
    return null;
  }

  const numFeedbacks = user.feedback.length;
  const sum = feedback.stars * (numFeedbacks - 1) + feedback.stars;
  await updateModel({ _id }, { $set: { rating: sum / numFeedbacks } });
};

export const removeFeedback = async (
  _id: string,
  feedbackId: string,
): Promise<User> =>
  await updateModel({ _id }, { $pull: { feedback: feedbackId } });

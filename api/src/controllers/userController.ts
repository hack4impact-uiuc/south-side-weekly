import { Request, Response } from 'express';

import User from '../models/user';
import Pitch from '../models/pitch';
import { onboardingStatusEnum } from '../utils/enums';
import { sendNotFound, sendSuccess } from '../utils/helpers';
import { getEditableFields, getViewableFields } from '../utils/user-utils';
import { sendApproveUserMail, sendRejectUserMail } from '../mail/sender';

import { populateUser } from './utils';

// CREATE controls

// Creates a User
export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const user = await User.create(req.body);

  sendSuccess(
    res,
    'User created successfully',
    await populateUser(user, populateType),
  );
};

// Stalls users in the database with onboarding status pending or onboarding scheduled
export const stallOldScheduledOnboarding = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const TWO_WEEKS_AGO = 13;

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - TWO_WEEKS_AGO);

  await User.updateMany(
    {
      dateJoined: { $lt: twoWeeksAgo },
      onboardingStatus: onboardingStatusEnum.ONBOARDING_SCHEDULED,
    },
    {
      $set: {
        onboardingStatus: onboardingStatusEnum.STALLED,
      },
    },
  );

  sendSuccess(
    res,
    'Stalled users that have not been onboarded in the last two weeks',
  );
};

// READ controls

// Gets all of the users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const users = await User.find({}).lean();

  sendSuccess(
    res,
    'Users retrieved successfully',
    await populateUser(users, populateType),
  );
};

// Gets all of the approved users
export const getApproved = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const users = await User.find({
    onboardingStatus: onboardingStatusEnum.ONBOARDED,
  }).lean();

  sendSuccess(
    res,
    'Users retrieved successfully',
    await populateUser(users, populateType),
  );
};

// Gets all of the pending users
export const getPendingUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const users = await User.find({
    onboardingStatus: {
      $in: [
        onboardingStatusEnum.ONBOARDING_SCHEDULED,
        onboardingStatusEnum.STALLED,
      ],
    },
  }).lean();

  sendSuccess(
    res,
    'Users retrieved successfully',
    await populateUser(users, populateType),
  );
};

// Gets all of the denied Users
export const getDeniedUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const users = await User.find({
    onboardingStatus: onboardingStatusEnum.DENIED,
  }).lean();

  sendSuccess(
    res,
    'Users retrieved successfully',
    populateUser(users, populateType),
  );
};

// Gets a user by id
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const user = await User.findById(req.params.id).lean();

  if (!user) {
    sendNotFound(res, 'User not found');
    return;
  }

  sendSuccess(
    res,
    'User retrieved successfully',
    populateUser(user, populateType),
  );
};

// Gets a user's permissions
export const getUserPermissions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const permissions = {
    view: getViewableFields(req.user, req.params.id),
    edit: getEditableFields(req.user, req.params.id),
  };

  sendSuccess(res, 'Permissions retrieved successfully', permissions);
};

// UPDATE controls

// Updates a user
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
  }

  sendSuccess(
    res,
    'User created successfully',
    populateUser(user, populateType),
  );
};

// Marks a page on the dashboard as visited for a user
export const visitPage = async (req: Request, res: Response): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        visitedPages: req.body.page,
      },
    },
    { new: true },
  ).lean();

  sendSuccess(
    res,
    'User created successfully',
    await populateUser(user, populateType),
  );
};

// Approves a user for the dashboard
export const approveUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { onboardingStatus: onboardingStatusEnum.ONBOARDED },
    { new: true, runValidators: true },
  ).lean();

  sendApproveUserMail(updatedUser, req.user);

  if (!updatedUser) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
    return;
  }

  sendSuccess(
    res,
    'User onboarded successfully',
    await populateUser(updatedUser, populateType),
  );
};

// Rejects a user for the dashboard
export const rejectUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { onboardingStatus: onboardingStatusEnum.DENIED },
    { new: true, runValidators: true },
  ).lean();

  sendRejectUserMail(updatedUser, req.user);

  if (!updatedUser) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
    return;
  }

  sendSuccess(
    res,
    'User denied successfully',
    await populateUser(updatedUser, populateType),
  );
};

// Adds a pitch to a user's claimed pitches
export const claimPitch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  if (await Pitch.exists({ _id: req.body.pitchId })) {
    sendNotFound(res, `Pitch not found with id ${req.body.pitchId}`);
    return;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { claimedPitches: req.body.pitchId },
      lastActive: new Date(),
    },
    { new: true, runValidators: true },
  ).lean();

  if (!updatedUser) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
    return;
  }

  sendSuccess(
    res,
    'User claimed pitch successfully',
    await populateUser(updatedUser, populateType),
  );
};

// DELETE controls

// Deletes a user from the database - UNUSED
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const user = await User.findByIdAndDelete(req.params.id).lean();

  if (!user) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
  }

  sendSuccess(
    res,
    'User deleted successfully',
    await populateUser(user, populateType),
  );
};

import { Request, Response } from 'express';

import Pitch from '../models/pitch.model';
import { onboardingStatusEnum } from '../utils/enums';
import { sendNotFound, sendSuccess, sendUnauthorized } from '../utils/helpers';
import { getEditableFields, getViewableFields } from '../utils/user-utils';
import { sendApproveUserMail, sendRejectUserMail } from '../mail/sender';
import { UserService } from '../services';

import { populateUser } from '../populators/user.populate';
import { extractOptions, extractPopulateQuery } from './utils';

// CREATE controls

// Creates a User
export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);

  const user = await UserService.add(req.body);

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

  await UserService.stall(twoWeeksAgo);

  sendSuccess(
    res,
    'Stalled users that have not been onboarded in the last two weeks',
  );
};

// READ controls

// Gets all of the users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);

  const options = extractOptions(req.query);

  const users = await UserService.getAll(options);

  const response = {
    users: await populateUser(users.data, populateType),
    count: users.count,
  };

  sendSuccess(res, 'Users retrieved successfully', response);
};

// Gets all of the approved users
export const getApproved = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const users = await UserService.getWithOnboardStatus(
    [onboardingStatusEnum.ONBOARDED],
    options,
  );

  const response = {
    users: await populateUser(users.data, populateType),
    count: users.count,
  };

  sendSuccess(res, 'Users retrieved successfully', response);
};

// Gets all of the pending users
export const getPendingUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const users = await UserService.getWithOnboardStatus(
    [onboardingStatusEnum.ONBOARDING_SCHEDULED, onboardingStatusEnum.STALLED],
    options,
  );

  sendSuccess(res, 'Users retrieved successfully', {
    users: await populateUser(users.data, populateType),
    count: users.count,
  });
};

// Gets all of the denied Users
export const getDeniedUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const users = await UserService.getWithOnboardStatus(
    [onboardingStatusEnum.DENIED],
    options,
  );

  sendSuccess(res, 'Users retrieved successfully', {
    users: await populateUser(users.data, populateType),
    count: users.count,
  });
};

// Gets a user by id
export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (req.isUnauthenticated()) {
    sendUnauthorized(res);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  const user = await UserService.getOne(req.user._id);

  if (!user) {
    sendNotFound(res, 'User not found');
    return;
  }

  sendSuccess(
    res,
    'User retrieved successfully',
    await populateUser(user, populateType),
  );
};

// Gets a user by id
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);

  const user = await UserService.getOne(req.params.id);

  if (!user) {
    sendNotFound(res, 'User not found');
    return;
  }

  sendSuccess(
    res,
    'User retrieved successfully',
    await populateUser(user, populateType),
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
  const populateType = extractPopulateQuery(req.query);

  const user = await UserService.update(req.params.id, req.body);

  if (!user) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
  }

  sendSuccess(
    res,
    'User created successfully',
    await populateUser(user, populateType),
  );
};

// Marks a page on the dashboard as visited for a user
export const visitPage = async (req: Request, res: Response): Promise<void> => {
  const populateType = req.query.populate ? 'full' : 'default';

  const user = await UserService.markPageVisited(req.user._id, req.body.page);

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
  const populateType = extractPopulateQuery(req.query);

  const user = await UserService.setOnboardStatus(
    req.params.id,
    onboardingStatusEnum.ONBOARDED,
  );

  if (!user) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
    return;
  }

  sendApproveUserMail(user, user);

  sendSuccess(
    res,
    'User onboarded successfully',
    await populateUser(user, populateType),
  );
};

// Rejects a user for the dashboard
export const rejectUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);

  const user = await UserService.setOnboardStatus(
    req.params.id,
    onboardingStatusEnum.DENIED,
  );

  sendRejectUserMail(user, req.user);

  if (!user) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
    return;
  }

  sendSuccess(
    res,
    'User denied successfully',
    await populateUser(user, populateType),
  );
};

// Adds a pitch to a user's claimed pitches
export const claimPitch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);

  if (await Pitch.exists({ _id: req.body.pitchId })) {
    sendNotFound(res, `Pitch not found with id ${req.body.pitchId}`);
    return;
  }

  const user = await UserService.addClaimedPitch(
    req.params.id,
    req.body.pitchId,
  );

  if (!user) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
    return;
  }

  sendSuccess(
    res,
    'User claimed pitch successfully',
    await populateUser(user, populateType),
  );
};

// DELETE controls

// Deletes a user from the database - UNUSED
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);

  const user = await UserService.remove(req.params.id);

  if (!user) {
    sendNotFound(res, `User not found with id ${req.params.id}`);
  }

  sendSuccess(
    res,
    'User deleted successfully',
    await populateUser(user, populateType),
  );
};

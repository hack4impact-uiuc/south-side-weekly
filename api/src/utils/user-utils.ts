import { IUser } from 'ssw-common';
import { difference, isArray } from 'lodash';
import { Request } from 'express';
import { isAdmin } from './auth-utils';
import User, { UserSchema } from '../models/user';
import { Document, Query } from 'mongoose';

type UserKeys = (keyof IUser)[];

// All fields in user
const allFields = Object.keys(User.schema.paths);

const nonViewableFields: UserKeys = ['oauthID'];

const nonEditableFields: UserKeys = ['_id', 'oauthID'];

// Only Admin can view these fields
const adminViewableFields: UserKeys = ['phone'];

// Only Admin can edit these fields
const adminEditableFields: UserKeys = ['teams', 'role', 'email', 'races'];

const userSearchableFields: UserKeys = [
  'firstName',
  'preferredName',
  'lastName',
  'email',
];

/**
 * Gets the fields of another user the current user can view
 *
 * @param currentUser the logged in user
 * @param userId the user to be viewed
 * @returns the viewable fields for the current user
 */
const getViewableFields = (currentUser: IUser, userId: string): UserKeys => {
  const viewableFields = difference(allFields, nonViewableFields) as UserKeys;

  if (isAdmin(currentUser) || currentUser._id.toString() === userId) {
    return viewableFields;
  }

  return difference(viewableFields, adminViewableFields);
};

/**
 * Gets the fields of another user that the current user can edit
 *
 * @param currentUser the logged in user
 * @param userId the user to be edited
 * @returns the editable fields for the current user
 */
const getEditableFields = (currentUser: IUser, userId: string): UserKeys => {
  const editableFields = difference(allFields, nonEditableFields) as UserKeys;
  if (isAdmin(currentUser)) {
    return editableFields;
  } else if (currentUser._id.toString() === userId) {
    return difference(editableFields, adminEditableFields);
  }

  return [];
};

const processFilters = <T extends Document<any>>(
  req: Request,
  query: Query<T[], T, Record<string, unknown>>,
): void => {
  type valueType = typeof req.query.value;
  type queryFilter = Record<string, valueType | Record<string, valueType | Date>>;
  const filters: queryFilter = {};
  if (req.query.activity) {
    const activity = req.query.activity as string;
    const now = new Date();

    const ACTIVE_PERIOD = 3;
    const ActiveCutoff = new Date(now.getUTCFullYear(), now.getUTCMonth() - ACTIVE_PERIOD - 1, now.getUTCDate());
    const RecentlyActiveCutoff = new Date(now.getUTCFullYear()-1, now.getUTCMonth(), now.getUTCDate());
    console.log(RecentlyActiveCutoff.toString());
    if (activity === 'Active') {
      query.find({lastActive: {$gte: ActiveCutoff}} as any);
    } else if (activity === 'Recently Active') {
      query.find({lastActive: {$gte: RecentlyActiveCutoff, $lt: ActiveCutoff}} as any);
    } else {
      query.find({lastActive: {$lt: RecentlyActiveCutoff}} as any);
    }
  }
  const queryParams = Object.keys(req.query).filter((key) =>
    allFields.includes(key),
  );

  queryParams.forEach((key) => {
    const query = req.query[key];
    if (isArray(query)) {
      filters[key] = { $all: query };
    } else {
      filters[key] = query;
    }
  });

  if (Object.keys(filters).length) {
    //TODO: type should be more specific than 'any'
    query.find(filters as any);
  }
};

const processPagination = <T extends Document<any>>(
  req: Request,
  query: Query<T[], T, Record<string, unknown>>,
): void => {
  if (req.query.page && req.query.limit) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    const sortBy = req.query.sortBy as string;
    const sortDirection = req.query.sortDirection as string;

    if (sortBy) {
      query.sort({ sortBy: sortDirection });
    }

    const skipIndex = (page - 1) * limit;
    query.limit(limit).skip(skipIndex);
  }
};

const searchUsers = (
  req: Request,
  query: Query<UserSchema[], UserSchema, Record<string, unknown>>,
): void => {
  if (req.query.search) {
    const searchKey = req.query.search as string;
    query.find({
      $or: userSearchableFields.map((field) => {
        const searchParam: Record<string, Record<string, string>> = {};
        searchParam[field] = {
          $regex: searchKey,
          $options: 'i',
        };
        return searchParam;
      }),
    });
  }
};

export {
  allFields,
  getEditableFields,
  getViewableFields,
  processPagination,
  processFilters,
  searchUsers,
};

import { IUser } from 'ssw-common';
import { difference } from 'lodash';
import { Request } from 'express';
import { isAdmin } from './auth-utils';
import User from '../models/user';
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
  type queryFilter = Record<string, valueType | Record<string, valueType>>;
  const excludedFields = ['page', 'sort', 'sortBy', 'claimStatus', 'limit'];
  const filters: queryFilter = {};
  for (const key in req.query) {
    if (key in excludedFields) {
      continue;
    }
    if (req.query[key] instanceof Array) {
      filters[key] = { $all: req.query[key] };
    } else {
      filters[key] = req.query[key];
    }
  }
  if (Object.keys(filters).length) {
    //TODO: type should be more specific than 'any'
    query.find(filters as any);
  }
};

const processPaignation = <T extends Document<any>>(
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

export {
  allFields,
  getEditableFields,
  getViewableFields,
  processPaignation,
  processFilters,
};

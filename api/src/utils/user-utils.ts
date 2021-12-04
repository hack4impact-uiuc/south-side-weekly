import { IUser } from 'ssw-common';
import { difference } from 'lodash';
import { Request } from 'express';
import { isAdmin } from './auth-utils';
import User, { UserSchema } from '../models/user';
import { Query } from 'mongoose';

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

export { allFields, getEditableFields, getViewableFields, searchUsers };

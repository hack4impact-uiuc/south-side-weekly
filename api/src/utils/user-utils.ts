import { difference } from 'lodash';
import { isAdmin } from './auth-utils';
import User from '../models/user';
import { SessionUser } from './helpers';

// All fields in user
const allFields = Object.keys(User.schema.paths);

const nonViewableFields = ['oauthID', '__v'];

const nonEditableFields = ['_id', 'oauthID', '__v'];
// Fields that non-Admins and other users cannot view
const privateFields = ['phone'];
// Fields that non-Admins cannot edit
const adminEditOnlyFields = ['currentTeams', 'role', 'email'];

/**
 * Gets the fields of another user the current user can view
 *
 * @param currentUser the logged in user
 * @param userId the user to be viewed
 * @returns the viewable fields for the current user
 */
const getViewableFields = (
  currentUser: SessionUser,
  userId: string,
): string[] => {
  const viewableFields = difference(allFields, nonViewableFields);

  if (isAdmin(currentUser) || currentUser._id.toString() === userId) {
    return viewableFields;
  }

  return difference(viewableFields, privateFields);
};

/**
 * Gets the fields of another user that the current user can edit
 *
 * @param currentUser the logged in user
 * @param userId the user to be edited
 * @returns the editable fields for the current user
 */
const getEditableFields = (
  currentUser: SessionUser,
  userId: string,
): string[] => {
  const editableFields = difference(allFields, nonEditableFields);
  if (isAdmin(currentUser)) {
    return editableFields;
  } else if (currentUser._id.toString() === userId) {
    return difference(editableFields, adminEditOnlyFields);
  }

  return [];
};

export { allFields, getEditableFields, getViewableFields };

import { difference } from 'lodash';
import { isAdmin } from '../middleware/auth';
import User from '../models/user';
import { SessionUser } from './helpers';

// All fields in user
const allFields = Object.keys(User.schema.paths);

const neverViewableFields = ['oauthID', '__v'];

const neverEditableFields = ['_id', 'oauthID', '__v'];
// Fields that non-Admins and other users cannot view
const nonViewableFiles = ['phone'];
// Fields that non-Admins cannot edit
const nonEditableFields = ['currentTeams', 'role', 'email'];

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
  const viewableFields = difference(allFields, neverViewableFields);

  if (isAdmin(currentUser) || currentUser._id.toString() === userId) {
    return viewableFields;
  }

  return difference(viewableFields, nonViewableFiles);
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
  const editableFields = difference(allFields, neverEditableFields);
  if (isAdmin(currentUser)) {
    return editableFields;
  } else if (currentUser._id.toString() === userId) {
    return difference(editableFields, nonEditableFields);
  }

  return [];
};

export { allFields, getEditableFields, getViewableFields };

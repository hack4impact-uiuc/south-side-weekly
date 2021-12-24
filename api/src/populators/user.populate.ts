import User, { UserSchema } from '../models/user';
import { PopulateType, populateTypes } from './types';
import {
  getPopulateOptions,
  interestFields,
  pitchFields,
  userFields,
} from './utils';

/**
 * Populates a user's ref fields
 *
 * @param user the user to populate
 * @param type the type of population to do
 */
export const populateUser = async (
  user: PopulateType<UserSchema>,
  type: populateTypes,
): Promise<PopulateType<UserSchema>> => {
  if (type === 'none') {
    return user;
  }

  const baseOptions = [
    { ...getPopulateOptions('teams', 'Team') },
    {
      ...getPopulateOptions('interests', 'Interest'),
    },
  ];

  if (type === 'default' || type !== 'full') {
    return await User.populate(user, baseOptions);
  }

  const paths = [
    ...baseOptions,
    { ...getPopulateOptions<UserSchema>('claimedPitches', 'Pitch') },
    { ...getPopulateOptions<UserSchema>('submittedPitches', 'Pitch') },
    { ...getPopulateOptions<UserSchema>('submittedClaims', 'Pitch') },
    {
      ...getPopulateOptions<UserSchema>('feedback', 'UserFeedback'),
    },
  ];

  return await User.populate(user, paths);
};

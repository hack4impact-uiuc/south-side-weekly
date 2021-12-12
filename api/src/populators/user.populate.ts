import User, { UserSchema } from '../models/user';
import { PopulateType, populateTypes } from './types';
import { getPopulateOptions } from './utils';

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

  if (type === 'default') {
    return await User.populate(user, baseOptions);
  }

  const paths = [
    ...baseOptions,
    { ...getPopulateOptions('claimedPitches', 'Pitch') },
    { ...getPopulateOptions('submittedPitches', 'Pitch') },
    { ...getPopulateOptions('submittedClaims', 'Pitch') },
  ];

  return await User.populate(user, paths);
};

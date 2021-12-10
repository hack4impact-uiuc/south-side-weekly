import { IInterest, IPitch, ITeam } from 'ssw-common';

import User, { UserSchema } from '../models/user';
import { LeanDocument, PopulateOptions } from 'mongoose';

const buildPath = (
  path: PopulateOptions['path'],
  select: PopulateOptions['select'],
  model: PopulateOptions['model'],
): PopulateOptions => ({
  path: path,
  select,
  model,
  options: { lean: true },
});

type PitchFields = Pick<
  IPitch,
  | 'title'
  | 'description'
  | 'createdAt'
  | 'topics'
  | 'status'
  | 'editStatus'
  | 'deadline'
>;
type TeamFields = Pick<ITeam, 'name' | 'color' | 'active'>;
type InterestFields = Pick<IInterest, 'name' | 'color' | 'active'>;

/**
 * Populates a user's ref fields
 *
 * @param user the user to populate
 * @param type the type of population to do
 */
export const populateUser = async (
  user:
    | UserSchema
    | UserSchema[]
    | LeanDocument<UserSchema>
    | LeanDocument<UserSchema>[],
  type: 'default' | 'full',
): Promise<UserSchema> => {
  const teamFields: Record<keyof TeamFields, number> = {
    name: 1,
    color: 1,
    active: 1,
  };
  const interestFields: Record<keyof InterestFields, number> = {
    ...teamFields,
  };
  const pitchFields: Record<keyof PitchFields, number> = {
    title: 1,
    description: 1,
    createdAt: 1,
    topics: 1,
    status: 1,
    editStatus: 1,
    deadline: 1,
  };

  const defaultPaths = [
    { ...buildPath('teams', teamFields, 'Team') },
    {
      ...buildPath('interests', interestFields, 'Interest'),
    },
  ];

  if (type === 'default') {
    return await User.populate(user, defaultPaths);
  }

  const paths = [
    ...defaultPaths,
    { ...buildPath('claimedPitches', pitchFields, 'Pitch') },
    { ...buildPath('submittedPitches', pitchFields, 'Pitch') },
    { ...buildPath('submittedClaims', pitchFields, 'Pitch') },
  ];

  return await User.populate(user, paths);
};

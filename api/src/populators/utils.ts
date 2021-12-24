import { PopulateOptions } from 'mongoose';
import { UserFields } from 'ssw-common';
import {
  InterestFields,
  Models,
  PitchFields,
  SelectFields,
  TeamFields,
} from './types';

export const getPopulateOptions = <T>(
  path: keyof T & string,
  model: Models,
  populate?: PopulateOptions,
): PopulateOptions => ({
  path,
  select: getModelFields(model),
  model: model,
  populate,
});

const selectModelFields = <T>(fields: (keyof T)[]): SelectFields<T> => ({
  ...fields.reduce(
    (acc, field) => ({ ...acc, [field]: 1 }),
    {} as SelectFields<T>,
  ),
});

export const teamFields = selectModelFields<TeamFields>([
  'name',
  'color',
  'active',
]);

export const interestFields = selectModelFields<InterestFields>([
  'name',
  'color',
  'active',
]);

export const pitchFields = selectModelFields<PitchFields>([
  'title',
  'description',
  'createdAt',
  'topics',
  'status',
  'editStatus',
  'deadline',
  'issueStatuses',
]);

export const userFields = selectModelFields<UserFields>([
  'role',
  'firstName',
  'lastName',
  'email',
  'preferredName',
  'lastActive',
  'genders',
  'pronouns',
  'teams',
  'interests',
  'fullname',
  'joinedNames',
  'activityStatus',
  'shortName',
  'profilePic',
  'rating',
]);

const getModelFields = (
  model: Models,
): SelectFields<InterestFields | TeamFields | PitchFields> => {
  switch (model) {
    case 'Interest':
      return interestFields;
    case 'Team':
      return teamFields;
    case 'Pitch':
      return pitchFields;
    case 'User':
      return userFields;
    default:
      return {};
  }
};

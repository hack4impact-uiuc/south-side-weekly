import { LeanDocument } from 'mongoose';
import { IInterest, IPitch, ITeam, IUser } from 'ssw-common';

export type PopulateType<T> = T | T[] | LeanDocument<T> | LeanDocument<T>[];

export type populateTypes = 'none' | 'default' | 'full';

export type Models =
  | 'User'
  | 'Resource'
  | 'Interest'
  | 'Team'
  | 'Pitch'
  | 'Issue'
  | 'PitchFeedback'
  | 'UserFeedback'
  | 'Auth' // not a model, but an endpoint
  | 'Constants'; // not a model, but an endpoint

export type SelectFields<T> = Record<keyof T, number>;

export type PitchFields = Pick<
  IPitch,
  | 'title'
  | 'description'
  | 'createdAt'
  | 'topics'
  | 'status'
  | 'editStatus'
  | 'deadline'
  | 'issueStatuses'
>;
export type UserFields = Pick<
  IUser,
  | 'role'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'preferredName'
  | 'lastActive'
  | 'genders'
  | 'pronouns'
  | 'teams'
  | 'interests'
>;
export type TeamFields = Pick<ITeam, 'name' | 'color' | 'active'>;
export type InterestFields = Pick<IInterest, 'name' | 'color' | 'active'>;

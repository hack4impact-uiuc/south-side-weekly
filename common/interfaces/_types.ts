import { Pitch } from './pitch.interface';
import { Team } from './team.interface';
import { Interest } from './interest.interface';
import { User } from './user.interface';
import { Issue } from './issue.interface';

export type UserFields = Pick<
  User,
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
  | 'fullname'
  | 'joinedNames'
  | 'activityStatus'
  | '_id'
  | 'shortName'
  | 'profilePic'
  | 'rating'
>;

export type PitchFields = Pick<
  Pitch,
  | 'title'
  | 'description'
  | 'createdAt'
  | 'topics'
  | 'status'
  | 'editStatus'
  | 'deadline'
  | 'issueStatuses'
  | '_id'
>;
export type IssueFields = Pick<
  Issue,
  'name' | 'deadlineDate' | 'releaseDate' | 'name' | 'type' | '_id'
>;
export type TeamFields = Pick<Team, 'name' | 'active' | 'color' | '_id'>;
export type InterestFields = Pick<
  Interest,
  'name' | 'active' | 'color' | '_id'
>;

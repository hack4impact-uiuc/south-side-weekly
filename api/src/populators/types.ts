import { LeanDocument } from 'mongoose';
import { IInterest, IPitch, ITeam } from 'ssw-common';

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
  | 'UserFeedback';

export type SelectFields<T> = Record<keyof T, number>;

export type InterestFields = Pick<IInterest, 'name' | 'color' | 'active'>;
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
export type TeamFields = Pick<ITeam, 'name' | 'color' | 'active'>;

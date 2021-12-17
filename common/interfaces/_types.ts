import { Pitch } from './pitch.interface';
import { Team } from './team.interface';
import { Interest } from './interest.interface';
import { User } from './user.interface';

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
>;
export type TeamFields = Pick<Team, 'name' | 'active' | 'color'>;
export type InterestFields = Pick<Interest, 'name' | 'active' | 'color'>;
import { Issue } from "./issue.interface";
import { InterestFields, TeamFields, UserFields } from "./_types";

export interface Pitch {
  _id: string;
  title: string;
  author: string;
  writer: string;
  primaryEditor: string;
  secondEditors: string[];
  thirdEditors: string[];
  description: string;
  status: string;
  assignmentStatus: string;
  assignmentGoogleDocLink: string;
  assignmentContributors: { userId: string; teams: string[] }[];
  pendingContributors: {
    userId: string;
    teams: string[];
    message: string;
    dateSubmitted: Date;
    status: string;
  }[];
  topics: string[];
  teams: {
    teamId: string;
    target: number;
  }[];
  reviewedBy: string;
  deadline: Date;
  conflictOfInterest: boolean;
  neighborhoods: string[];
  createdAt: Date;
  updatedAt: Date;
  issueStatuses: { issueId: string; issueStatus: string }[];
  editStatus: string;
}

type BasePitchOmitFields =
  'pitches'
  | 'teams'
  | 'assignmentContributors'
  | 'author'
  | 'writer'
  | 'primaryEditor'
  | 'secondEditors'
  | 'thirdEditors'
  | 'topics'
  | 'reviewedBy'
  | 'issueStatuses';

export interface BasePopulatedPitch extends Omit<Pitch, BasePitchOmitFields> {
  teams: {
    teamId: TeamFields;
    target: number;
  }[];
  topics: InterestFields[];
  assignmentContributors: { userId: UserFields; teams: TeamFields[] }[];
  author: UserFields;
  writer: UserFields;
  primaryEditor: UserFields;
  secondEditors: UserFields[];
  thirdEditors: UserFields[];
  reviewedBy: UserFields;
  issueStatuses: { issueId: Issue; status: string }[];
}

type FullPitchOmitFields = BasePitchOmitFields | 'issues' | 'pendingContributors';

export interface PendingContributor {
  userId: UserFields;
  teams: TeamFields[];
  message: string;
  dateSubmitted: Date;
  status: string;
}

export interface FullPopulatedPitch extends Omit<Pitch, FullPitchOmitFields> {
  pendingContributors: PendingContributor[];
  teams: {
    teamId: TeamFields;
    target: number;
  }[];
  topics: InterestFields[];
  assignmentContributors: { userId: UserFields; teams: TeamFields[] }[];
  author: UserFields;
  writer: UserFields;
  primaryEditor: UserFields;
  secondEditors: UserFields[];
  thirdEditors: UserFields[];
  reviewedBy: UserFields;
  issueStatuses: { issueId: Issue; status: string }[];
}
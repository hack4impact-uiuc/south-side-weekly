import { PitchFields } from "./_types";

export interface Issue {
    _id: string;
    name: string;
    deadlineDate: string;
    releaseDate: string;
    pitches: string[];
    type: string;
}

type BaseIssueOmitFields = 'pitches';

export interface PopulatedIssue extends Omit<Issue, BaseIssueOmitFields> {
  pitches: PitchFields[];
}
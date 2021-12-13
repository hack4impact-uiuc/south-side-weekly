import { IIssue } from 'ssw-common';

export interface IIssueContext {
  issues: IIssue[];
  getIssueFromId: (id: string) => IIssue | undefined;
  fetchIssues: () => void;
}

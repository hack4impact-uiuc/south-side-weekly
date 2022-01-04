import { Issue } from 'ssw-common';

export interface IIssueContext {
  issues: Issue[];
  getIssueFromId: (id: string) => Issue | undefined;
  fetchIssues: () => Promise<void>;
}

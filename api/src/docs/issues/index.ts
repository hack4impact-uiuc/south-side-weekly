import { getIssueById, getIssues, getIssueBuckets } from './get';
import { createIssue } from './post';
import { updateIssue, updateIssueStatus } from './put';
import { deleteIssue } from './delete';

export const issuePaths = {
  '/issues': {
    ...getIssues,
  },
  '/issues/:id': {
    ...getIssueById,
    ...createIssue,
    ...updateIssue,
    ...deleteIssue,
  },
  '/issues/updateIssueStatus/:pitchId': {
    ...updateIssueStatus,
  },
  '/issues/pitchBuckets/:id': {
    ...getIssueBuckets,
  },
};

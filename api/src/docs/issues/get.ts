import { buildPath } from '../utils';

export const getIssues = buildPath({
  method: 'GET',
  model: 'Issue',
  opId: 'getIssues',
  description: 'Gets all issues',
});

export const getIssueById = buildPath({
  method: 'GET',
  model: 'Issue',
  opId: 'getIssueById',
  description: 'Gets a issue by id',
  params: [{ name: 'id', description: 'The id of the issue' }],
});

export const getIssueBuckets = buildPath({
  method: 'GET',
  model: 'Issue',
  opId: 'getIssueBuckets',
  description: 'Gets all issue buckets',
  params: [{ name: 'id', description: 'The id of the pitch' }],
});

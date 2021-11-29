import { buildEndpoint, get } from '../builders';
import { Response } from '../types';
import { IssuesResponse } from './types';

const ISSUE_ENDPOINT = '/issues';

// Returns all of the issues in the database
const getIssues = async (): Promise<Response<IssuesResponse>> => {
  const url = buildEndpoint(ISSUE_ENDPOINT);
  const failureMessage = 'GET_ISSUES_FAIL';

  return await get(url, failureMessage);
};

export { getIssues };

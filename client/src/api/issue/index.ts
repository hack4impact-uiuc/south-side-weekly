import { IIssue } from 'ssw-common';

import { buildEndpoint, get, post } from '../builders';
import { Response } from '../types';

import { IssueResponse, IssuesResponse } from './types';

const ISSUE_ENDPOINT = '/issues';

// Returns all of the issues in the database
const getIssues = async (): Promise<Response<IssuesResponse>> => {
  const url = buildEndpoint(ISSUE_ENDPOINT);
  const failureMessage = 'GET_ISSUES_FAIL';

  return await get(url, failureMessage);
};

const createIssue = async (
  newIssue: Partial<IIssue>,
): Promise<Response<IssueResponse>> => {
  const url = buildEndpoint(ISSUE_ENDPOINT);
  const failureMessage = 'CREATE_ISSUE_FAIL';

  return await post(url, newIssue, failureMessage);
};

export { getIssues, createIssue };

import { IIssue } from 'ssw-common';

import { ApiResponseBase, Response } from '../types';
import { buildEndpoint, get, post, put } from '../builders';

const ISSUE_ENDPOINT = '/issues';

interface IssueReponse extends ApiResponseBase {
  result: IIssue;
}

interface IssuesResponse extends ApiResponseBase {
  result: IIssue[];
}

const getIssues = async (): Promise<Response<IssuesResponse>> => {
  const url = buildEndpoint(ISSUE_ENDPOINT);
  const failureMessage = 'Failed to get issues';

  return await get(url, failureMessage);
};

const getNearestIssue = async (): Promise<Response<IssueReponse>> => {
  const url = buildEndpoint(`${ISSUE_ENDPOINT}?current=true`);
  const failureMessage = 'Failed to get nearest issue';

  return await get(url, failureMessage);
};

const createIssue = async (
  issue: Partial<IIssue>,
): Promise<Response<IssueReponse>> => {
  const url = buildEndpoint(ISSUE_ENDPOINT);
  const failureMessage = 'Failed to create issue';

  return await post(url, { issue }, failureMessage);
};

const updateIssue = async (
  id: string,
  issue: Partial<IIssue>,
): Promise<Response<IssueReponse>> => {
  const url = buildEndpoint(ISSUE_ENDPOINT, id);
  const failureMessage = 'Failed to update issue';

  return await put(url, { issue }, failureMessage);
};

export { getIssues, createIssue, updateIssue, getNearestIssue };
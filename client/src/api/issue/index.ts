import { IIssue, IPitch } from 'ssw-common';

import { ApiResponseBase, Response } from '../types';
import { buildEndpoint, get, post, put } from '../builders';

const ISSUE_ENDPOINT = '/issues';

interface IssueReponse extends ApiResponseBase {
  result: IIssue;
}

interface IssuesResponse extends ApiResponseBase {
  result: IIssue[];
}

interface PitchBucketsResponse extends ApiResponseBase {
  result: { status: string; pitches: IPitch[] }[];
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

const getPitchBuckets = async (
  issueId: string,
): Promise<Response<PitchBucketsResponse>> => {
  const url = buildEndpoint(ISSUE_ENDPOINT, 'pitchBuckets', issueId);
  const failureMessage = 'Failed to get pitch buckets';

  return await get(url, failureMessage);
};

const updateIssueStatus = async (
  pitchId: string,
  issueId: string,
  issueStatus: string,
): Promise<Response<IPitch>> => {
  const url = buildEndpoint(ISSUE_ENDPOINT, 'updateIssueStatus', pitchId);
  const failureMessage = 'Failed to get pitch buckets';

  return await put(url, { issueId, issueStatus }, failureMessage);
};

export {
  getIssues,
  createIssue,
  updateIssue,
  getNearestIssue,
  getPitchBuckets,
  updateIssueStatus,
};

import { IIssue, IPitch } from 'ssw-common';

import { ApiResponseBase } from '../types';
export interface IssuesResponse extends ApiResponseBase {
  result: IIssue[];
}
export interface IssueResponse extends ApiResponseBase {
  result: IIssue;
}
export interface PitchBucketsResponse extends ApiResponseBase {
  result: { status: string; pitches: IPitch[] }[];
}

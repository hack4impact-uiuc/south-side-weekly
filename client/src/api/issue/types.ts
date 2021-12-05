import { IIssue } from 'ssw-common';

import { ApiResponseBase } from '../types';
export interface IssuesResponse extends ApiResponseBase {
  result: IIssue[];
}
export interface IssueResponse extends ApiResponseBase {
  result: IIssue;
}

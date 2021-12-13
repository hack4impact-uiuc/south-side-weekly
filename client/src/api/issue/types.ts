import { IIssue } from 'ssw-common';

import { ApiResponseBase } from '../types';
export interface IssuesResponse extends ApiResponseBase {
  result: {
    data: IIssue[];
    count: number;
  }
}

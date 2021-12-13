import { IResource } from 'ssw-common';

import { ApiResponseBase } from '../types';

export interface ResourceResponse extends ApiResponseBase {
  result: IResource;
}

export interface ResourcesResponse extends ApiResponseBase {
  result: {
    data: IResource[];
    count: number;
  };
}

export type DeleteResourceResponseType = ApiResponseBase;

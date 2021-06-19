import { IResource } from 'ssw-common';

import { ApiResponseBase } from '../types';

export interface CreateResourceResponseType extends ApiResponseBase {
  result: IResource;
}

export interface GetAllResourcesResponseType extends ApiResponseBase {
  result: IResource[];
}

export type DeleteResourceResponseType = ApiResponseBase;

export interface EditResourceResponseType extends ApiResponseBase {
  result: IResource;
}

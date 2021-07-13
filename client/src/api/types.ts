import { AxiosResponse } from 'axios';

export interface ErrorWrapper {
  type: string;
  error: any;
}

export type ApiResponse<T> = AxiosResponse<T> | ErrorWrapper;

export interface ApiResponseBase {
  message: string;
}

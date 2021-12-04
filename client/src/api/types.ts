import { AxiosResponse } from 'axios';

export interface ErrorWrapper {
  type: string;
  error: any;
}

export type ApiResponse<T> = AxiosResponse<T> | ErrorWrapper;

export interface ApiResponseBase {
  message: string;
  success: boolean;
}

export interface PaginationResponse<T> extends ApiResponseBase {
  result: T;
  totalPages: number;
}

export type Response<T> = AxiosResponse<T> | ErrorWrapper;

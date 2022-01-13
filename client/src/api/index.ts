import { ApiResponseBase, Response } from './types';
import { get, post, put, del } from './builders';

interface ApiCall {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: Record<string, unknown>;
  failureMessage?: string;
  query?: Record<string, unknown>;
  populate?: 'default' | 'full' | 'none';
}

const createQuery = (query: Record<string, unknown>): string => {
  let queryString = '';

  Object.keys(query).forEach((key, index) => {
    queryString += `${key}=${query[key]}`;
    if (index !== Object.keys(query).length - 1) {
      queryString += '&';
    }
  });

  return queryString;
};

interface ApiCallResponse<T> extends ApiResponseBase {
  result: T;
}

export const idify = (url: string, id: string): string =>
  url.replace(':id', id);

export const apiCall = async <T>(
  apiConfig: ApiCall,
): Promise<Response<ApiCallResponse<T>>> => {
  const {
    method,
    url,
    body = {},
    failureMessage = '',
    query = {},
    populate = 'none',
  } = apiConfig;

  const queryString = createQuery({ ...query, populate });
  const uri = queryString ? `${url}?${queryString}` : url;

  switch (method) {
    case 'GET':
      return await get(uri, failureMessage);
    case 'POST':
      return await post(uri, { ...body }, failureMessage);
    case 'PUT':
      return await put(uri, { ...body }, failureMessage);
    case 'DELETE':
      return await del(uri, failureMessage);
    default:
      throw new Error(`Invalid method: ${method}`);
  }
};

export * from './apiWrapper';
export * from './builders';

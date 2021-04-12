import axios, { AxiosResponse } from 'axios';
import { IUser, IResource } from 'ssw-common';

export const FRONTEND_BASE_URL = process.env.REACT_APP_VERCEL_URL
  ? `https://${process.env.REACT}`
  : 'http://localhost:3000';

export const BASE_URL = process.env.REACT_APP_VERCEL_URL
  ? `https://${process.env.REACT_APP_VERCEL_URL}/api`
  : 'http://localhost:9000/api';

export interface ErrorWrapper {
  type: string;
  error: any;
}

export type ApiResponse<T> = AxiosResponse<T> | ErrorWrapper;

export function isError<T>(res: ApiResponse<T>): res is ErrorWrapper {
  return (res as ErrorWrapper).error !== undefined;
}

export interface GetSampleResponseType {
  message: string;
}

export interface GetProfileResponseType {
  message: string;
  result: IUser;
}

export interface CreateResourceResponseType {
  message: string;
  result: IResource;
}

/**
 * Returns a sample API response to demonstrate a working backend
 * Returns GET_SAMPLE_FAIL upon failure
 */
export const getSampleResponse = (): Promise<
  AxiosResponse<GetSampleResponseType> | ErrorWrapper
> => {
  const requestString = `${BASE_URL}/users`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_SAMPLE_FAIL',
      error,
    }));
};

/**
 * Executes a sample POST request
 * Returns POST_SAMPLE_FAIL upon failure
 */
export const addSampleResponse = (
  body: unknown, // TODO: there should be a provided type here
): Promise<AxiosResponse<unknown> | ErrorWrapper> => {
  const requestString = `${BASE_URL}/home`;
  return axios
    .post(requestString, body, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'POST_SAMPLE_FAIL',
      error,
    }));
};

const user_id = '6031a866c70ec705736a79e5';

export const loadProfile = (): Promise<
  AxiosResponse<GetProfileResponseType> | ErrorWrapper
> => {
  const userUrl = `${BASE_URL}/users/${user_id}`;
  return axios
    .get(userUrl, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_PROFILE_FAIL',
      error,
    }));
};

export const saveProfile = (profileData: {
  [key: string]: string | boolean | string[] | Date | null;
}): Promise<AxiosResponse<GetProfileResponseType> | ErrorWrapper> => {
  const userUrl = `${BASE_URL}/users/${user_id}`;
  return axios
    .put(userUrl, profileData, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'POST_PROFILE_FAIL',
      error,
    }));
};

/**
 * Creates a new resource
 * Returns CREATE_RESOURCE_FAIL upon failure
 */
export const createResource = (
  newResource: IResource,
): Promise<AxiosResponse<CreateResourceResponseType> | ErrorWrapper> => {
  const requestString = `${BASE_URL}/resources`;
  return axios
    .post(requestString, newResource, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'CREATE_RESOURCE_FAIL',
      error,
    }));
};

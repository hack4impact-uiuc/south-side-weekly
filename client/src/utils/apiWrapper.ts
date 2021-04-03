import axios, { AxiosResponse } from 'axios';

import { IUser } from '../../../api/src/models/user';

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

export const loadProfile = async (): Promise<any> => {
  const userUrl = `${BASE_URL}/users/${user_id}`;
  try {
    const res = await axios.get(userUrl, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    });
    console.log(res.data.result);
    return res.data.result;
  } catch (err) {
    console.error(err);
  }
};

export const saveProfile = async (profileData: {
  [key: string]: string | boolean | string[] | null;
}): Promise<any> => {
  const userUrl = `${BASE_URL}/users/${user_id}`;
  try {
    const res = await axios.put(userUrl, profileData, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    });
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

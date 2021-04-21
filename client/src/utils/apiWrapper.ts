import axios, { AxiosResponse } from 'axios';
import { IPitch, IUser } from 'ssw-common';

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

export interface GetPitchesResponseType {
  message: string;
  result: [IPitch];
}

export interface GetOpenTeamsResponseType {
  message: string;
  result: IPitch['teams'];
}

export interface GetProfileResponseType {
  message: string;
  result: IUser;
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

/**
 * Returns all unclaimed and approved pitches
 * Returns GET_UNCLAIMED_PITCHES_FAIL upon failure
 */
export const getUnclaimedPitches = (): Promise<
  AxiosResponse<GetPitchesResponseType> | ErrorWrapper
> => {
  const requestString = `${BASE_URL}/pitch?unclaimed=true`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_UNCLAIMED_PITCHES_FAIL',
      error,
    }));
};

/**
 * Returns all open teams
 * Returns GET_OPEN_TEAMS_FAIL upon failure
 */
export const getOpenTeams = (
  pitchId: string,
): Promise<AxiosResponse<GetOpenTeamsResponseType> | ErrorWrapper> => {
  const requestString = `${BASE_URL}/pitch/${pitchId}/openTeams`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_OPEN_TEAMS_FAIL',
      error,
    }));
};

/**
 * Updates a pitch's Contributor Array
 * Returns POST_PITCH_FAIL upon failure
 */
export const updatePitchContributors = (
  userId: string,
  pitchId: string,
): Promise<AxiosResponse<GetPitchesResponseType> | ErrorWrapper> => {
  const pitchUrl = `${BASE_URL}/pitch/${pitchId}/contributors`;
  return axios
    .put(
      pitchUrl,
      { userId },
      {
        headers: {
          'Content-Type': 'application/JSON',
        },
      },
    )
    .catch((error) => ({
      type: 'POST_PITCH_CONTRIBUTORS_FAIL',
      error,
    }));
};

/**
 * Updates a user's claimed pitches
 * Returns POST_PITCH_FAIL upon failure
 */
export const updateClaimedPitches = (
  userId: string,
  pitchId: string,
): Promise<AxiosResponse<GetPitchesResponseType> | ErrorWrapper> => {
  const userUrl = `${BASE_URL}/users/${userId}/pitches`;
  return axios
    .put(
      userUrl,
      { pitchId },
      {
        headers: {
          'Content-Type': 'application/JSON',
        },
      },
    )
    .catch((error) => ({
      type: 'POST_USER_CLAIMED_PITCHES_FAIL',
      error,
    }));
};

/**
 * Updates a pitch
 * Returns POST_PITCH__FAIL upon failure
 */
export const updatePitch = (
  pitchData: { [key: string]: number | string },
  pitchId: string,
): Promise<AxiosResponse<GetPitchesResponseType> | ErrorWrapper> => {
  const pitchUrl = `${BASE_URL}/pitch/${pitchId}`;
  return axios
    .put(pitchUrl, pitchData, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'POST_PITCH_FAIL',
      error,
    }));
};

/**
 * Returns a user
 * Returns GET_PROFILE_FAIL upon failure
 */
export const loadUser = (
  userId: string,
): Promise<AxiosResponse<GetProfileResponseType> | ErrorWrapper> => {
  const userUrl = `${BASE_URL}/users/${userId}`;
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

/**
 * Updates a user
 * Returns GET_USER_FAIL upon failure
 */
export const saveUser = (
  profileData: {
    [key: string]: string | boolean | string[] | Date | null;
  },
  userId: string,
): Promise<AxiosResponse<GetProfileResponseType> | ErrorWrapper> => {
  const userUrl = `${BASE_URL}/users/${userId}`;
  return axios
    .put(userUrl, profileData, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'POST_USER_FAIL',
      error,
    }));
};

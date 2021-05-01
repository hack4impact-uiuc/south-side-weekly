import axios, { AxiosResponse } from 'axios';
import { IPitch, IUser, IResource } from 'ssw-common';

export const FRONTEND_BASE_URL = process.env.REACT_APP_VERCEL_URL
  ? `https://${process.env.REACT_APP_VERCEL_URL}`
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

export interface GetUsersResponseType {
  message: string;
  // TODO: Fix this from being an any type
  result: IUser[];
}

export interface UpdateUserResponseType {
  message: string;
  result: IUser;
}

export interface GetCurrentUserResponseType {
  message: string;
  result: IUser;
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

export interface GetAllResourcesResponseType {
  message: string;
  result: [IResource];
}

export interface CreateResourceResponseType {
  message: string;
  result: IResource;
}

export interface DeleteResourceResponseType {
  message: string;
}

export interface EditResourceResponseType {
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

/**
 * Returns a list of all of the users in the database
 * Returns GET_USERS_FETCH_FAIL upon failure
 */
export const getUsers = (): Promise<
  AxiosResponse<GetUsersResponseType> | ErrorWrapper
> => {
  const requestString = `${BASE_URL}/users`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_USERS_FETCH_FAIL',
      error,
    }));
};

/**
 * Updates user by userId and returns new user
 * Returns UPDATE_USER_FAIL upon failure
 * @param userId string user id in Mongo
 * @param firstName string
 * @param lastName string
 * @param preferredName string
 * @param phoneNumber string
 * @param genders string[]
 * @param pronouns string[]
 * @param reasonForInvolvement string
 * @param currentTeams string[]
 * @param role string
 * @param races string[]
 * @param interests string[]
 */
export const updateUser = (
  userId: string,
  firstName: string,
  lastName: string,
  preferredName: string,
  phoneNumber: string,
  genders: string[],
  pronouns: string[],
  reasonForInvolvement: string,
  currentTeams: string[],
  role: string,
  races: string[],
  interests: string[],
): Promise<AxiosResponse<GetUsersResponseType> | ErrorWrapper> => {
  const userUrl = `${BASE_URL}/users/${userId}`;

  const formData = {
    firstName: firstName !== '' ? firstName : null,
    lastName: lastName !== '' ? lastName : null,
    preferredName: preferredName !== '' ? preferredName : null,
    phone: phoneNumber !== '' ? phoneNumber : null,
    genders: genders !== [] ? genders : null,
    pronouns: pronouns !== [] ? pronouns : null,
    reasonForInvolvement:
      reasonForInvolvement !== '' ? reasonForInvolvement : null,
    currentTeams: currentTeams !== [] ? currentTeams : null,
    role: role !== '' ? role : null,
    races: races !== [] ? races : null,
    interests: interests !== [] ? interests : null,
  };

  return axios
    .put(userUrl, formData, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .then((res) => res.data.result)
    .catch((error) => ({
      type: 'UPDATE_USER_FAIL',
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
 * Returns a list of all of the users in the database
 * Returns GET_USERS_FETCH_FAIL upon failure
 */
export const getCurrentUser = (): Promise<
  AxiosResponse<GetCurrentUserResponseType> | ErrorWrapper
> => {
  const requestString = `${BASE_URL}/auth/currentUser`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_CURRENT_USER_FAIL',
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
 * Returns POST_USER_FAIL upon failure
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

/**
 * Gets all resources
 * Returns GET_ALL_RESOURCES_FAIL upon failure
 */
export const getAllResources = (): Promise<
  AxiosResponse<GetAllResourcesResponseType> | ErrorWrapper
> => {
  const requestString = `${BASE_URL}/resources`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'GET_ALL_RESOURCES_FAIL',
      error,
    }));
};

/**
 * Creates a new resource
 * Returns CREATE_RESOURCE_FAIL upon failure
 */
export const createResource = (newResource: {
  [key: string]: string | string[] | null;
}): Promise<AxiosResponse<CreateResourceResponseType> | ErrorWrapper> => {
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

/**
 * Deletes a resource
 * Returns DELETE_RESOURCE_FAIL upon failure
 */
export const deleteResource = (
  resourceId: string,
): Promise<AxiosResponse<DeleteResourceResponseType> | ErrorWrapper> => {
  const requestString = `${BASE_URL}/resources/${resourceId}`;
  return axios
    .delete(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'DELETE_RESOURCE_FAIL',
      error,
    }));
};

/**
 * Edits a resource
 * Returns EDIT_RESOURCE_FAIL upon failure
 */
export const editResource = (
  resourceId: string | undefined,
  editedResource: {
    [key: string]: string | string[] | null;
  },
): Promise<AxiosResponse<EditResourceResponseType> | ErrorWrapper> => {
  const requestString = `${BASE_URL}/resources/${resourceId}`;
  return axios
    .put(requestString, editedResource, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch((error) => ({
      type: 'EDIT_RESOURCE_FAIL',
      error,
    }));
};

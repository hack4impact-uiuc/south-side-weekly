import axios, { AxiosResponse } from 'axios';

import { BASE_URL } from './urls';
import { ErrorWrapper, ApiResponse } from './types';

// Generalized axios configuration
axios.defaults.headers.common['Content-Type'] = 'application/json';
const instance = axios.create({
  baseURL: BASE_URL,
});

/**
 * General GET request
 *
 * @param url the endpoint url to GET request to
 * @param failMessage a fail macro of the form GET_FUNCTION_FAIL
 * @returns API endpoint response object
 */
const get = async (
  url: string,
  failMessage: string,
): Promise<AxiosResponse<any> | ErrorWrapper> =>
  await instance.get(url).catch((error) => ({
    type: `GET_${failMessage}`,
    error,
  }));

/**
 * General POST request
 *
 * @param url the endpoint url to POST request to
 * @param body the body of data to pass to the endpoint
 * @param failMessage a fail macro of the form POST_FUNCTION_FAIL
 * @returns API endpoint response object
 */
const post = async (
  url: string,
  // eslint-disable-next-line
  body: any,
  failMessage: string,
): Promise<AxiosResponse<any> | ErrorWrapper> =>
  await instance.post(url, { body }).catch((error) => ({
    type: `POST_${failMessage}`,
    error,
  }));

/**
 * General PUT request
 *
 * @param url the endpoint url to PUT request to
 * @param body the body of data to pass to the endpoint
 * @param failMessage a fail macro of the form PUT_FUNCTION_FAIL
 * @returns API endopint response object
 */
const put = async (
  url: string,
  // eslint-disable-next-line
  body: any,
  failMessage: string,
): Promise<AxiosResponse<any> | ErrorWrapper> =>
  await instance.put(url, { body }).catch((error) => ({
    type: `PUT_${failMessage}`,
    error,
  }));

/**
 * General DELETE request
 *
 * @param url the endpoint url to DELETE request to
 * @param failMessage a fail macro of the form DELETE_FUNCTION_FAIL
 * @returns API endpoint response object
 */
const del = async (
  url: string,
  failMessage: string,
): Promise<AxiosResponse<any> | ErrorWrapper> =>
  await instance.put(url).catch((error) => ({
    type: `DELETE_${failMessage}`,
    error,
  }));

/**
 * Determines if the axios response resulted in an error
 *
 * @param res the response to check if errored
 * @returns true if response errored, else false
 */
export function isError<T>(res: ApiResponse<T>): res is ErrorWrapper {
  return (res as ErrorWrapper).error !== undefined;
}

/**
 * Constructs an URI with url parameters based on endpoint
 *
 * @param endpoint the endpoint to construct the URI for
 * @param successRedirect the success url query parameter to redirct to
 * @param failureRedirect the failure url query parameter to redirect to
 * @returns returns the uri href string
 */
const buildURI = (
  endpoint: string,
  successRedirect: string,
  failureRedirect = '/login',
): string => {
  const uri = new URL(`${BASE_URL}/${endpoint}`);

  switch (endpoint) {
    case 'auth/login':
      uri.searchParams.append('successRedirect', successRedirect);
      uri.searchParams.append('failureRedirect', failureRedirect);
      break;
    default:
      break;
  }

  return uri.href;
};

export { buildURI, get, post, put, del };

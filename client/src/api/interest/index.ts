import { IInterest } from 'ssw-common';

import { Response } from '../types';
import { buildEndpoint, get, post, put } from '../builders';

import { InterestsResponse, InterestResponse } from './types';

const INTEREST_ENDPOINT = '/interests';

// Returns all of the interests from the database
const getInterests = async (): Promise<Response<InterestsResponse>> => {
  const url = buildEndpoint(INTEREST_ENDPOINT);
  const failureMessage = 'Failed to get interests';

  return await get(url, failureMessage);
};

// Returns a single interest from the database
const getInterest = async (id: string): Promise<Response<InterestResponse>> => {
  const url = buildEndpoint(INTEREST_ENDPOINT, id);
  const failureMessage = 'Failed to get interest';

  return await get(url, failureMessage);
};

// Creates a new interest in the database
const createInterest = async (
  interest: Partial<IInterest>,
): Promise<Response<InterestResponse>> => {
  const url = buildEndpoint(INTEREST_ENDPOINT);
  const failureMessage = 'Failed to create interest';

  return await post(url, { interest }, failureMessage);
};

// Updates an interest in the database
const updateInterest = async (
  id: string,
  interest: Partial<IInterest>,
): Promise<Response<InterestResponse>> => {
  const url = buildEndpoint(INTEREST_ENDPOINT, id);
  const failureMessage = 'Failed to update interest';

  return await put(url, { interest }, failureMessage);
};

// Creates many interests in the database
const createManyInterests = async (
  interests: Partial<IInterest>[],
): Promise<Response<InterestResponse>> => {
  const url = buildEndpoint(INTEREST_ENDPOINT, 'many');
  const failureMessage = 'Failed to create many interests';

  return await post(url, { interests }, failureMessage);
};

// Updates many interests in the database
const updateManyInterests = async (
  interests: IInterest[],
): Promise<Response<InterestResponse>> => {
  const url = buildEndpoint(INTEREST_ENDPOINT, 'update', 'many');
  const failureMessage = 'Failed to update many interests';

  return await put(url, { interests }, failureMessage);
};

export {
  getInterests,
  getInterest,
  createInterest,
  updateInterest,
  updateManyInterests,
  createManyInterests,
};

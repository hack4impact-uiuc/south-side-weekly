import { ApiResponseBase, Response } from '../types';
import { buildEndpoint, del, get, post, put } from '../builders';

import { ResourceResponse, ResourcesResponse } from './types';

const RESOURCE_ENDPOINT = '/resources';

// Returns all of the resources
const getAllResources = async (): Promise<Response<ResourcesResponse>> => {
  const url = buildEndpoint(RESOURCE_ENDPOINT);
  const failureMessage = 'GET_ALL_RESOURCES_FAIL';

  return await get(url, failureMessage);
};

// Creates a resource
const createResource = async (newResource: {
  [key: string]: string | string[] | null;
}): Promise<Response<ResourceResponse>> => {
  const url = buildEndpoint(RESOURCE_ENDPOINT);
  const failureMessage = 'CREATE_RESOURCE_FAIL';

  return await post(url, newResource, failureMessage);
};

// Deletes a resource
const deleteResource = async (
  resourceId: string,
): Promise<Response<ApiResponseBase>> => {
  const url = buildEndpoint(RESOURCE_ENDPOINT, resourceId);
  const failureMessage = 'DELETE_RESOURCE_FAIL';

  return await del(url, failureMessage);
};

// Edits a resource
const editResource = async (
  resourceId: string,
  editedResource: {
    [key: string]: string | string[] | null;
  },
): Promise<Response<ResourceResponse>> => {
  const url = buildEndpoint(RESOURCE_ENDPOINT, resourceId!);
  const failureMessage = 'EDIT_RESOURCE_FAIL';

  return await put(url, editedResource, failureMessage);
};
export { getAllResources, createResource, deleteResource, editResource };

import { ApiResponseBase, Response } from '../types';
import { del, get, post, put } from '../builders';

import { ResourceResponse, ResourcesResponse } from './types';

const RESOURCE_ENDPOINT = '/resources';

// Returns all of the resources
const getAllResources = async (): Promise<Response<ResourcesResponse>> =>
  await get(RESOURCE_ENDPOINT, 'GET_ALL_RESOURCES_FAIL');

// Creates a resource
const createResource = async (newResource: {
  [key: string]: string | string[] | null;
}): Promise<Response<ResourceResponse>> =>
  await post(RESOURCE_ENDPOINT, newResource, 'CREATE_RESOURCE_FAIL');

// Deletes a resource
const deleteResource = async (
  resourceId: string,
): Promise<Response<ApiResponseBase>> =>
  await del(`${RESOURCE_ENDPOINT}/${resourceId}`, 'DELETE_RESOURCE_FAIL');

// Edits a resource
const editResource = async (
  resourceId: string | undefined,
  editedResource: {
    [key: string]: string | string[] | null;
  },
): Promise<Response<ResourceResponse>> =>
  await put(
    `${RESOURCE_ENDPOINT}/${resourceId}`,
    editedResource,
    'EDIT_RESOURCE_FAIL',
  );

export { getAllResources, createResource, deleteResource, editResource };

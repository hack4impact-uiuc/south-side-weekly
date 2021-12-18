import { getResourceById, getResources } from './get';
import { createResource } from './post';
import { updateResource } from './put';
import { deleteResource } from './delete';

export const resourcePaths = {
  '/resources': {
    ...getResources,
  },
  '/resources/:id': {
    ...getResourceById,
    ...createResource,
    ...updateResource,
    ...deleteResource,
  },
};

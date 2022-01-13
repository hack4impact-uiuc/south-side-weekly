import Resource, { ResourceSchema } from '../models/resource.model';
import { PopulateType, populateTypes } from './types';
import { getPopulateOptions } from './utils';

export const populateResource = async (
  resource: PopulateType<ResourceSchema>,
  type: populateTypes,
): Promise<PopulateType<ResourceSchema>> => {
  if (type === 'none') {
    return resource;
  }

  const baseOptions = [{ ...getPopulateOptions('teams', 'Team') }];

  return await Resource.populate(resource, baseOptions);
};

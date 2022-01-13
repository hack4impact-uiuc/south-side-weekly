import _ from 'lodash';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IResource } from 'ssw-common';

import Resource, { ResourceSchema } from '../models/resource.model';
import { visibilityEnum } from '../utils/enums';
import { PaginateOptions } from './types';

interface ResourcesResponse {
  data: LeanDocument<ResourceSchema>[];
  count: number;
}
type Resource = Promise<LeanDocument<ResourceSchema>>;

const paginate = async (
  definedFilters: FilterQuery<ResourceSchema>,
  options?: PaginateOptions<ResourceSchema>,
): Promise<ResourcesResponse> => {
  const { offset, limit, sort, filters } = options || {};
  const mergedFilters = _.merge(filters, definedFilters);

  const users = await Resource.find(mergedFilters)
    .skip(offset * limit)
    .limit(limit)
    .sort(sort)
    .collation({ locale: 'en' })
    .lean();

  const count = await Resource.countDocuments(mergedFilters);

  return {
    data: users,
    count,
  };
};

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: UpdateQuery<T>,
): Resource =>
  await Resource.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const isNameTaken = async (name: string): Promise<boolean> =>
  await Resource.exists({ name });

export const isLinkTaken = async (link: string): Promise<boolean> =>
  await Resource.exists({ link });

export const add = async (payload: Partial<IResource>): Resource =>
  await Resource.create(payload);

export const getOne = async (_id: string): Resource =>
  await Resource.findById({ _id }).lean();

export const getByName = async (
  name: string,
  options?: PaginateOptions<ResourceSchema>,
): Promise<ResourcesResponse> => await paginate({ teams: name }, options);

export const getAll = async (
  isApproved: boolean,
  options?: PaginateOptions<ResourceSchema>,
): Promise<ResourcesResponse> =>
  await paginate(
    !isApproved ? { visibility: visibilityEnum.PUBLIC } : {},
    options,
  );

export const update = async (
  _id: string,
  payload: Partial<IResource>,
): Resource => await updateModel({ _id }, payload);

export const remove = async (_id: string): Resource =>
  await Resource.findByIdAndRemove({ _id });

import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { IResource } from 'ssw-common';

import Resource, { ResourceSchema } from '../models/resource';
import { visibilityEnum } from '../utils/enums';

type Resources = Promise<LeanDocument<ResourceSchema>[]>;
type Resource = Promise<LeanDocument<ResourceSchema>>;

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

export const getAll = async (isApproved: boolean): Resources => {
  if (!isApproved) {
    return await Resource.find({ visibility: visibilityEnum.PUBLIC }).lean();
  }

  return await Resource.find({}).lean();
};

export const update = async (
  _id: string,
  payload: Partial<IResource>,
): Resource => await updateModel({ _id }, payload);

export const remove = async (_id: string): Resource =>
  await Resource.findByIdAndRemove({ _id });

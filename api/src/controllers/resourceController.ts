import { Request, Response } from 'express';
import { Query } from 'mongoose';
import { IResource } from 'ssw-common';

import Resource, { ResourceSchema } from '../models/resource';
import { onboardingStatusEnum, visibilityEnum } from '../utils/enums';
import { sendNotFound, sendSuccess } from '../utils/helpers';

type ResourceQuery = Query<
  ResourceSchema | ResourceSchema[],
  ResourceSchema,
  unknown
>;
type IdParam = { id: string };

const populateResourceQuery = async (
  resource: ResourceQuery,
): Promise<IResource> => resource.populate('teams').lean();

const populateResourceSchema = async (
  resource: ResourceSchema,
): Promise<IResource> => resource.populate('teams');

// CREATE controls

type CreateReqBody = Partial<IResource>;
type CreateReq = Request<IdParam, never, CreateReqBody, never>;

export const createResource = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  if (await Resource.exists({ name: req.body.name })) {
    res.status(409).json({
      message: 'Resource with this name already exists',
      success: false,
    });
    return;
  } else if (await Resource.exists({ link: req.body.link })) {
    res.status(409).json({
      message: 'Resource with this link already exists',
      success: false,
    });
    return;
  }

  const resource = await Resource.create(req.body);

  if (resource) {
    sendSuccess(res, 'Resource created', resource);
  }
};

// READ controls

export const getResources = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // If user does not have an approved role, only show public resources
  if (req.user.onboardingStatus !== onboardingStatusEnum.ONBOARDED) {
    const resources = await populateResourceQuery(
      Resource.find({
        visibility: visibilityEnum.PUBLIC,
      }),
    );

    sendSuccess(res, 'Resources retrieved successfully', resources);
    return;
  }

  // If user is onboarded, return all resources
  const resources = await Resource.find({});
  sendSuccess(res, 'Resources retrieved successfully', resources);
};

type GetByIdReq = Request<IdParam>;

export const getResource = async (
  req: GetByIdReq,
  res: Response,
): Promise<void> => {
  const resource = await populateResourceQuery(
    Resource.findById(req.params.id),
  );

  if (!resource) {
    sendNotFound(res, 'Resource not found');
    return;
  }

  sendSuccess(res, 'Resource retrieved successfully', resource);
};

// UPDATE controls

type UpdateReqBody = Partial<IResource>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updateResource = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).then(populateResourceSchema);

  if (!resource) {
    sendNotFound(res, 'Resource not found');
    return;
  }

  sendSuccess(res, 'Resource updated successfully', resource);
};

// DELETE controls

type DeleteReq = Request<IdParam>;

export const deleteResource = async (
  req: DeleteReq,
  res: Response,
): Promise<void> => {
  const deletedResource = await Resource.findByIdAndDelete(req.params.id);

  if (!deletedResource) {
    sendNotFound(res, 'Resource not found');
    return;
  }

  sendSuccess(res, 'Resource deleted successfully', deletedResource);
};

import { Request, Response } from 'express';
import { IResource } from 'ssw-common';

import { ResourceService } from '../services';
import { onboardingStatusEnum } from '../utils/enums';
import { sendNotFound, sendSuccess } from '../utils/helpers';
import { populateResource } from '../populators';

import { extractOptions, extractPopulateQuery } from './utils';

type IdParam = { id: string };

// CREATE controls

export const createResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const [isNameTaken, isLinkTaken] = await Promise.all([
    ResourceService.isNameTaken(req.body.name),
    ResourceService.isLinkTaken(req.body.link),
  ]);

  if (isNameTaken) {
    res.status(409).json({
      message: 'Resource with this name already exists',
      success: false,
    });
    return;
  }

  if (isLinkTaken) {
    res.status(409).json({
      message: 'Resource with this link already exists',
      success: false,
    });
    return;
  }

  const populateType = extractPopulateQuery(req.query);
  const resource = await ResourceService.add(req.body);

  sendSuccess(
    res,
    'Resource created',
    await populateResource(resource, populateType),
  );
};

// READ controls

export const getResources = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const options = extractOptions(req.query);

  // If user does not have an approved role, only show public resources
  const resources = await ResourceService.getAll(
    req.user.onboardingStatus === onboardingStatusEnum.ONBOARDED,
    options,
  );
  const populateType = extractPopulateQuery(req.query);

  sendSuccess(res, 'Resources retrieved successfully', {
    data: await populateResource(resources.data, populateType),
    count: resources.count,
  });
};

type GetByIdReq = Request<IdParam>;

export const getResource = async (
  req: GetByIdReq,
  res: Response,
): Promise<void> => {
  const resource = await ResourceService.getOne(req.params.id);

  if (!resource) {
    sendNotFound(res, 'Resource not found');
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Resource retrieved successfully',
    await populateResource(resource, populateType),
  );
};

export const getResourceByName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const options = extractOptions(req.query);

  const resource = await ResourceService.getByName(
    req.user.onboardingStatus === onboardingStatusEnum.ONBOARDED,
    req.params.name,
    options,
  );

  if (!resource) {
    sendNotFound(res, 'Resource not found');
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(res, 'Resource retrieved successfully', {
    data: await populateResource(resource.data, populateType),
    count: resource.count,
  });
};

// UPDATE controls

type UpdateReqBody = Partial<IResource>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updateResource = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const resource = await ResourceService.update(req.params.id, req.body);

  if (!resource) {
    sendNotFound(res, 'Resource not found');
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Resource updated successfully',
    await populateResource(resource, populateType),
  );
};

// DELETE controls

type DeleteReq = Request<IdParam>;

export const deleteResource = async (
  req: DeleteReq,
  res: Response,
): Promise<void> => {
  const deletedResource = await ResourceService.remove(req.params.id);

  if (!deletedResource) {
    sendNotFound(res, 'Resource not found');
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Resource deleted successfully',
    await populateResource(deletedResource, populateType),
  );
};

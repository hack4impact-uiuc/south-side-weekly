import { Request, Response } from 'express';
import { IUserFeedback } from 'ssw-common';

import { sendNotFound, sendSuccess } from '../utils/helpers';
import { UserFeedbackService, UserService } from '../services';
import {
  extractOptions,
  extractPopulateQuery,
} from './utils';
import { populateUserFeedback } from '../populators';

type IdParam = { id: string };

// CREATE controls

type CreateReqQuery = Partial<IUserFeedback>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createUserFeedback = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const newFeedback = await UserFeedbackService.add(req.body);
  await UserService.addFeedback(newFeedback.userId, newFeedback.id);

  const populateType = extractPopulateQuery(req.query);

  if (newFeedback) {
    sendSuccess(
      res,
      'Feedback created successfully',
      await populateUserFeedback(newFeedback, populateType),
    );
  }
};

// READ controls

export const getAllUserFeedback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const options = extractOptions(req.query);
  const feedback = await UserFeedbackService.getAll(options);

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(res, 'Feedback retrieved successfully', {
    data: await populateUserFeedback(feedback.data, populateType),
    count: feedback.count,
  });
};

type GetUserFeedbackReq = Request<IdParam>;

export const getUserFeedback = async (
  req: GetUserFeedbackReq,
  res: Response,
): Promise<void> => {
  const feedback = await UserFeedbackService.getOne(req.params.id);

  if (!feedback) {
    sendNotFound(res, 'Feedback not found');
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'User feedback retrieved successfully',
    await populateUserFeedback(feedback, populateType),
  );
};

type GetAllFeedbackForUser = Request<IdParam>;

export const getAllFeedbackForUser = async (
  req: GetAllFeedbackForUser,
  res: Response,
): Promise<void> => {
  const options = extractOptions(req.query);

  const feedback = await UserFeedbackService.getAllFeedbackForUser(
    req.params.id,
    options,
  );

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(res, 'Feedback retrieved successfully', {
    data: await populateUserFeedback(feedback.data, populateType),
    count: feedback.count,
  });
};

// UPDATE controls

type UpdateReqBody = Partial<IUserFeedback>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updateUserFeedback = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const feedback = await UserFeedbackService.update(req.params.id, req.body);

  if (!feedback) {
    sendNotFound(res, 'Feedback not found');
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Feedback updated successfully',
    await populateUserFeedback(feedback, populateType),
  );
};

// DELETE controls

type DeleteUserFeedback = Request<IdParam>;

export const deleteUserFeedback = async (
  req: DeleteUserFeedback,
  res: Response,
): Promise<void> => {
  const deletedFeedback = await UserFeedbackService.remove(req.params.id);

  if (!deletedFeedback) {
    sendNotFound(res, 'Feedback not found');
    return;
  }
  const populateType = extractPopulateQuery(req.query);

  await UserService.removeFeedback(deletedFeedback.userId, deletedFeedback.id);

  sendSuccess(
    res,
    'Feedback deleted successfully',
    await populateUserFeedback(deletedFeedback, populateType),
  );
};

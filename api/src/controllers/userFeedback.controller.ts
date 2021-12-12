import { Request, Response } from 'express';
import { IUserFeedback } from 'ssw-common';

import { sendNotFound, sendSuccess } from '../utils/helpers';
import { UserFeedbackService, UserService } from '../services';

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

  if (newFeedback) {
    sendSuccess(res, 'Feedback created successfully', newFeedback);
  }
};

// READ controls

export const getAllUserFeedback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const feedback = await UserFeedbackService.getAll();

  sendSuccess(res, 'Feedback retrieved successfully', feedback);
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

  sendSuccess(res, 'User feedback retrieved successfully', feedback);
};

type GetAllFeedbackForUser = Request<IdParam>;

export const getAllFeedbackForUser = async (
  req: GetAllFeedbackForUser,
  res: Response,
): Promise<void> => {
  const feedback = await UserFeedbackService.getAllFeedbackForUser(
    req.params.id,
  );

  sendSuccess(res, 'Feedback retrieved successfully', feedback);
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

  sendSuccess(res, 'Feedback updated successfully', feedback);
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

  await UserService.removeFeedback(deletedFeedback.userId, deletedFeedback.id);

  sendSuccess(res, 'Feedback deleted successfully', deletedFeedback);
};

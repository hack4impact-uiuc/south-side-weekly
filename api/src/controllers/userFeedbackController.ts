import { Request, Response } from 'express';
import { IUserFeedback } from 'ssw-common';

import UserFeedback from '../models/userFeedback';
import User from '../models/user';
import { sendNotFound, sendSuccess } from '../utils/helpers';

type IdParam = { id: string };

// CREATE controls

type CreateReqQuery = Partial<IUserFeedback>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createUserFeedback = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const newFeedback = await UserFeedback.create(req.body);

  await User.findByIdAndUpdate(newFeedback.userId, {
    $addToSet: {
      feedback: newFeedback._id,
    },
  });

  if (newFeedback) {
    sendSuccess(res, 'Feedback created successfully', newFeedback);
  }
};

// READ controls

export const getAllUserFeedback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const feedback = await UserFeedback.find({});

  sendSuccess(res, 'Feedback retrieved successfully', feedback);
};

type GetUserFeedbackReq = Request<IdParam>;

export const getUserFeedback = async (
  req: GetUserFeedbackReq,
  res: Response,
): Promise<void> => {
  const feedback = await UserFeedback.findById(req.params.id);

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
  const feedback = await UserFeedback.find({ userId: req.params.id });

  sendSuccess(res, 'Feedback retrieved successfully', feedback);
};

// UPDATE controls

type UpdateReqBody = Partial<IUserFeedback>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updateUserFeedback = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const feedback = await UserFeedback.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );

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
  const deletedFeedback = await UserFeedback.findByIdAndDelete(req.params.id);

  if (!deletedFeedback) {
    sendNotFound(res, 'Feedback not found');
    return;
  }

  await User.findByIdAndUpdate(deletedFeedback.userId, {
    $pull: {
      feedback: deletedFeedback._id,
    },
  });

  sendSuccess(res, 'Feedback deleted successfully', deletedFeedback);
};

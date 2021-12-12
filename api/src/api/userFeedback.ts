import express, { Request, Response } from 'express';

import { errorWrap } from '../middleware';
import { requireAdmin } from '../middleware/auth';

import UserFeedback from '../models/userFeedback';
import User from '../models/user';

const router = express.Router();

// Gets feedback by id
router.get(
  '/:id',
  errorWrap(async (req: Request, res: Response) => {
    const feedback = await UserFeedback.findById(req.params.id);
    if (!feedback) {
      res.status(404).json({
        success: false,
        message: 'User feedback not found with id',
      });
    } else {
      res.status(200).json({
        success: true,
        result: feedback,
        message: `Successfully retrieved user feedback`,
      });
    }
  }),
);

// Gets feedback for a user on a pitch
router.get(
  '/userFeedback',
  errorWrap(async (req: Request, res: Response) => {
    const { userId, pitchId } = req.body;

    const feedback = await UserFeedback.findOne({
      userId: userId,
      pitchId: pitchId,
    });
    if (!feedback) {
      res.status(404).json({
        success: false,
        message: 'User feedback not found for user on pitch',
      });
    } else {
      res.status(200).json({
        success: true,
        result: feedback,
        message: `Successfully retrieved user feedback`,
      });
    }
  }),
);

// Gets all feedback
router.get(
  '/',
  errorWrap(async (req: Request, res: Response) => {
    const feedback = await UserFeedback.find({});
    res.status(200).json({
      message: `Successfully retrieved all user feedback.`,
      success: true,
      result: feedback,
    });
  }),
);

// Gets all feedback for a specific user
router.get(
  '/user/:id',
  errorWrap(async (req: Request, res: Response) => {
    const feedback = await UserFeedback.find({ userId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Feedback retrieved successfully',
      result: feedback,
    });
  }),
);

// Create a new feedback
router.post(
  '/',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const newFeedback = await UserFeedback.create({
      ...req.body,
      staffId: req.user._id,
    });

    await User.findByIdAndUpdate(newFeedback.userId, {
      $addToSet: {
        feedback: newFeedback._id,
      },
    });

    if (newFeedback) {
      res.status(200).json({
        message: 'Successfully created new userFeedback',
        success: true,
        result: newFeedback,
      });
    }
  }),
);

// Updates a specific feedback
router.put(
  '/:id',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const feedback = await UserFeedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      result: feedback,
    });
  }),
);

// Deletes a specific feedback
router.delete(
  '/:id',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const feedbackToDelete = await UserFeedback.findByIdAndDelete(
      req.params.id,
    );

    await User.findByIdAndUpdate(feedbackToDelete.userId, {
      $pull: {
        feedback: feedbackToDelete._id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  }),
);

export default router;

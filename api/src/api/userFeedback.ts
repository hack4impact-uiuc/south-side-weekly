import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import { requireAdmin } from '../middleware/auth';

import UserFeedback from '../models/userFeedback';

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

// Gets all feedback for contributors
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

// Gets all of the feedback for a specific user
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
    const newFeedback = await UserFeedback.create(req.body);
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
  errorWrap(async (req: Request, res: Response) => {
    await UserFeedback.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  }),
);

export default router;

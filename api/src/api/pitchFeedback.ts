import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';
import { requireAdmin, requireRegistered } from '../middleware/auth';

import PitchFeedback from '../models/pitchFeedback';

const router = express.Router();

// Gets all of the anonymous feedback
router.get(
  '/',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const feedback = await PitchFeedback.find({});

    res.status(200).json({
      success: true,
      message: 'Feedback retrieved successfully',
      result: feedback,
    });
  }),
);

// Creates a new feedback
router.post(
  '/',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const createFeedback = await PitchFeedback.create({ ...req.body });

    // Avoids returning the userId on the response
    const feedback = await PitchFeedback.findById(createFeedback._id);

    res.status(200).json({
      success: true,
      message: 'Feedback created successfully',
      result: feedback,
    });
  }),
);

// Gets a specific feedback
router.get(
  '/:id',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const feedback = await PitchFeedback.findById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Feedback retrieved successfully',
      result: feedback,
    });
  }),
);

// Gets all of the feedback for a specific pitch
router.get(
  '/pitch/:id',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const feedback = await PitchFeedback.find({ pitchId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Feedback retrieved successfully',
      result: feedback,
    });
  }),
);

// Updates a specific feedback
router.put(
  '/:id',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const feedback = await PitchFeedback.findByIdAndUpdate(
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
    await PitchFeedback.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  }),
);

export default router;

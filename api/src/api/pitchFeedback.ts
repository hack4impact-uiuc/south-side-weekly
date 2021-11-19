import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import PitchFeedback from '../models/pitchFeedback';

const router = express.Router();

// Gets all of the anonomous feedback
router.get(
  '/',
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
  errorWrap(async (req: Request, res: Response) => {
    const createFeedback = await PitchFeedback.create({ ...req.body });
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
  errorWrap(async (req: Request, res: Response) => {
    await PitchFeedback.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  }),
);

export default router;

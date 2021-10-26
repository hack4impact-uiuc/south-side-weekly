import express, { Request, Response } from 'express';

import { errorWrap } from '../middleware';
import { requireAdmin, requireRegistered } from '../middleware/auth';
import Interest from '../models/interest';

const router = express.Router();

// Get all interests
router.get(
  '/',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const interests = await Interest.find({});
    res.status(200).json({
      message: `Successfully retrieved all interests.`,
      success: true,
      result: interests,
    });
  }),
);

// Get a single interest
router.get(
  '/:id',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const interest = await Interest.findById(req.params.id);

    if (!interest) {
      res.status(404).json({
        message: `Interest with id ${req.params.id} not found.`,
        success: false,
      });
      return;
    }
    res.status(200).json({
      message: `Successfully retrieved interest.`,
      success: true,
      result: interest,
    });
  }),
);

// Create a new interest
router.post(
  '/',
  // requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const interest = await Interest.create(req.body);

    res.status(200).json({
      message: `Successfully created interest.`,
      success: true,
      result: interest,
    });
  }),
);

// Update an interest
router.put(
  '/:id',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const interest = await Interest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!interest) {
      res.status(404).json({
        message: `Interest with id ${req.params.id} not found.`,
        success: false,
      });
      return;
    }

    res.status(200).json({
      message: `Successfully updated interest.`,
      success: true,
      result: interest,
    });
  }),
);

export default router;

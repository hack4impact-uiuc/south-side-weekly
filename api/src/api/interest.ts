import express, { Request, Response } from 'express';
import { IInterest } from '../../../common';

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
  requireAdmin,
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

// Create many new interests
router.post(
  '/many',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const newInterests: Partial<IInterest>[] = req.body.interests;

    const createdInterests = await Promise.all(
      newInterests.map(async (interest) => Interest.create(interest)),
    );

    const failedInterests = createdInterests.filter((interest) => !interest);

    if (failedInterests.length > 0) {
      const failedInterestNames = failedInterests.map((interest) => interest.name);

      res.status(400).json({
        message: `Failed to create interests: ${failedInterestNames.join(', ')}`,
        success: false,
      });
    }

    res.status(200).json({
      message: 'Successfully created all interests',
      success: true,
      result: createdInterests,
    });
  }),
);

// Update many changed interests
router.put(
  '/many',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const changedInterests: IInterest[] = req.body.interests;
    const updatedInterests = await Promise.all(
      changedInterests.map(async (interest) => {
        const body = {
          name: interest.name,
          color: interest.color,
          active: interest.active,
        };

        return Interest.findByIdAndUpdate(interest._id, body, {
          new: true,
          // runValidators: true,
        });
      }),
    );

    const failedInterests = updatedInterests.filter((interest) => !interest);

    if (failedInterests.length > 0) {
      const failedInterestNames = failedInterests.map((interest) => interest.name);

      res.status(400).json({
        message: `Failed to create interests: ${failedInterestNames.join(', ')}`,
        success: false,
      });
    }

    res.status(200).json({
      message: 'Successfully created all interests',
      success: true,
      result: updatedInterests,
    });
  }),
);

export default router;

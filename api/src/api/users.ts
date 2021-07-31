import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { errorWrap } from '../middleware';

import User from '../models/user';
import Pitch from '../models/pitch';
import { getEditableFields, getViewableFields } from '../utils/user-utils';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = express.Router();

/**
 * Validates an ID to whether or not it is a valid MongoDB ID or not
 * @param id Potential User ID to validate
 */
const isValidMongoId = (id: string): boolean => ObjectId.isValid(id);

// Gets all users
router.get(
  '/',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const users = await User.find({});
    res.status(200).json({
      message: `Successfully retrieved all users.`,
      success: true,
      result: users,
    });
  }),
);

// Gets user by id
router.get(
  '/:userId',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.userId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
    } else {
      res.status(200).json({
        success: true,
        result: user,
        message: `Successfully retrieved user`,
      });
    }
  }),
);

// Gets a users permissions
router.get(
  '/:userId/permissions',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    res.json({
      success: true,
      result: {
        view: getViewableFields(req.user, req.params.userId),
        edit: getEditableFields(req.user, req.params.userId),
      },
    });
  }),
);

// Create a new user
router.post(
  '/',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const newUser = await User.create(req.body);
    if (newUser) {
      res.status(200).json({
        message: 'Successfully created new user',
        success: true,
        result: newUser,
      });
    }
  }),
);

// Updates a user
router.put(
  '/:userId',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.userId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated user',
      result: updatedUser,
    });
  }),
);

// Deletes a user
router.delete(
  '/:userId',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.userId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User successfully deleted',
      result: deletedUser,
    });
  }),
);

// Add pitch to a user's claimed pitches
router.put(
  '/:userId/pitches',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.userId)) {
      res.status(400).json({
        success: false,
        message: 'Bad user ID format',
      });
      return;
    } else if (!isValidMongoId(req.body.pitchId)) {
      res.status(400).json({
        success: false,
        message: 'Bad pitch ID format',
      });
      return;
    }

    const pitch = await Pitch.findById(req.body.pitchId);
    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { claimedPitches: req.body.pitchId } },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully added pitch to user',
      result: updatedUser,
    });
  }),
);

export default router;

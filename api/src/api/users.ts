import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { errorWrap } from '../middleware';

import User from '../models/user';

const router = express.Router();

/**
 * Validates an ID to whether or not it is a valid MongoDB ID or not
 * @param id Potential User ID to validate
 */
const isValidMongoId = (id: string): boolean => ObjectId.isValid(id);

// Gets all users
router.get(
  '/',
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

// Create a new user
router.post(
  '/',
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
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.userId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const user = req.body;
    Object.keys(user).forEach((key) => user[key] === null && delete user[key]);

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, user, {
      new: true,
      runValidators: true,
    });

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

export default router;

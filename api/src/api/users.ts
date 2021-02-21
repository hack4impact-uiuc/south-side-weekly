import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { errorWrap } from '../middleware';

import User from '../models/user';

const router = express.Router();

const isValidMongoId = (id: string): boolean => ObjectId.isValid(id);

router.get(
  '/',
  errorWrap(async (req: Request, res: Response) => {
    const user = await User.find({});
    res.status(200).json({
      message: `Successfully retrieved all users.`,
      success: true,
      result: user,
    });
  }),
);

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
        message: `Successfully retrieved user with id ${user.id}`,
      });
    }
  }),
);

// Create a new user
router.post(
  '/new',
  errorWrap(async (req: Request, res: Response) => {
    const newUser = await User.create(req.body);
    if (newUser) {
      res.status(200).json({
        message: 'Succesfully created new user',
        success: true,
        result: newUser,
      });
    }
  }),
);        

export default router;

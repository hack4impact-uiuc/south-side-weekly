import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import User from '../models/user';

const router = express.Router();

router.get(
  '/',
  errorWrap(async (req: Request, res: Response) => {
    const user = await User.findOne();
    res.status(200).json({
      message: `Successfully retrieved ${user.name} users.`,
      success: true,
      result: user,
    });
  }),
);

// Create a new user, given 
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

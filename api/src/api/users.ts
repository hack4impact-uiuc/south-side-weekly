import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import User from '../models/user';

const router = express.Router();

router.get(
  '/',
  errorWrap(async (req: Request, res: Response) => {
    const users = await User.find();
    res.status(200).json({
      message: `Successfully retrieved ${users.length} users.`,
      success: true,
      result: users,
    });
  }),
);

export default router;

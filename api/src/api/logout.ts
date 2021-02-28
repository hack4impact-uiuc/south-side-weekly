import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

const router = express.Router();

router.get(
  '/logout',
  errorWrap(async (req: Request, res: Response): Promise<void> => {
    req.logout();
    res.status(200).json({
      message: `You have been signed out!`,
      success: true,
    });
  }),
);

export default router;

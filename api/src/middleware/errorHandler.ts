import { Request, Response } from 'express';

export default (err: Error, req: Request, res: Response): void => {
  console.error(err);
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: err.message,
    result: {},
    success: false,
  });
};

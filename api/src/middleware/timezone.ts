import { NextFunction, Request, Response } from 'express';

export default (timezone: string) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  process.env.TZ = timezone;
  next();
};

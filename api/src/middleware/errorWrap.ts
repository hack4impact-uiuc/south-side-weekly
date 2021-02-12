import { Request, Response, NextFunction } from 'express';

/*
 * Middleware to allow us to safely handle errors in async/await code
 * without wrapping each route in try...catch blocks
 */
export default (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => (req: Request, res: Response, next: NextFunction): Promise<void> =>
  Promise.resolve(fn(req, res, next)).catch(next) as Promise<void>;

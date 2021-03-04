import { Request, Response, NextFunction } from 'express';
import { roleEnum } from '../models/user';
import validateRequestForRole from './authvalidators';

const requireContributorStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (
    validateRequestForRole(req, roleEnum.CONTRIBUTOR) ||
    validateRequestForRole(req, roleEnum.STAFF) ||
    validateRequestForRole(req, roleEnum.ADMIN)
  ) {
    return next();
  }
  res.status(401).send('You are not authorized (requires contributor status).');
};

const requireStaffStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (
    validateRequestForRole(req, roleEnum.STAFF) ||
    validateRequestForRole(req, roleEnum.ADMIN)
  ) {
    return next();
  }
  res.status(401).send('You are not authorized (requires staff status).');
};

const requireAdminStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (validateRequestForRole(req, roleEnum.ADMIN)) {
    return next();
  }
  res.status(401).send('You are not authorized (requires admin status).');
};

module.exports = {
  requireContributorStatus,
  requireStaffStatus,
  requireAdminStatus,
};

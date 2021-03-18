import { Request, Response, NextFunction } from 'express';
import { rolesEnum } from '../utils/enums';
import validateRequestForRole from './authvalidators';

export const requireContributorStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (
    validateRequestForRole(req, rolesEnum.CONTRIBUTOR) ||
    validateRequestForRole(req, rolesEnum.STAFF) ||
    validateRequestForRole(req, rolesEnum.ADMIN)
  ) {
    return next();
  }
  res.status(401).json({
    message: `You are not authorized (requires contributor status).`,
    success: false,
  });
};

export const requireStaffStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (
    validateRequestForRole(req, rolesEnum.STAFF) ||
    validateRequestForRole(req, rolesEnum.ADMIN)
  ) {
    return next();
  }
  res.status(401).json({
    message: `You are not authorized (requires staff status).`,
    success: false,
  });
};

export const requireAdminStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (validateRequestForRole(req, rolesEnum.ADMIN)) {
    return next();
  }
  res.status(401).json({
    message: `You are not authorized (requires admin status).`,
    success: false,
  });
};

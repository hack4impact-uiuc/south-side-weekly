import { Request, Response, NextFunction } from 'express';
import { hasRole } from '../utils/auth-utils';
import { rolesEnum } from '../utils/enums';

/**
 * Middleware to prevent users that aren't registered or don't have a
 * specified role from completing requests
 *
 * @param roles the set of roles allowed to make the given request
 * @param requireApproved whether or not their role is required to be approved, default true
 * @returns 401 HTTP Response if the user lacks the necessary role, else calls
 *          next() to continue to request
 */
const requireRole = (roles: string[], requireApproved = true) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isUnauthenticated() || !hasRole(req.user, roles, requireApproved)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  next();
};

// Requires a user to have an account
const requireRegistered = requireRole(
  [rolesEnum.TBD, rolesEnum.CONTRIBUTOR, rolesEnum.STAFF, rolesEnum.ADMIN],
  false,
);

// Requires a user to have at least Contributor status
const requireContributor = requireRole([
  rolesEnum.CONTRIBUTOR,
  rolesEnum.STAFF,
  rolesEnum.ADMIN,
]);

// Requires a user to have at least Staff status
const requireStaff = requireRole([rolesEnum.STAFF, rolesEnum.ADMIN]);

// Requires a user to have Admin status
const requireAdmin = requireRole([rolesEnum.ADMIN]);

const requestSecretHeader = 'x-request-secret';
/**
 * Middleware that makes sure the request contains the pre-defined request secret as a header
 * @returns 401 HTTP Response if the request doesn't have the header or the request secret doesn't match
 *          otherwise calls next() to continue to request
 */
const requireRequestSecret = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  const requestSecretHeaderValue = req.headers[requestSecretHeader];
  if (requestSecretHeaderValue !== process.env.REQUEST_SECRET) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  next();
};

export {
  requireRegistered,
  requireContributor,
  requireStaff,
  requireAdmin,
  requireRequestSecret,
};

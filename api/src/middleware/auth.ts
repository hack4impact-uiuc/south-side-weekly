import { Request, Response, NextFunction } from 'express';
import { hasRole } from '../utils/auth-utils';
import { rolesEnum } from '../utils/enums';

/**
 * Middleware to prevent users that aren't registered or don't have a
 * specified role from completing requests
 *
 * @param roles the set of roles allowed to make the given request
 * @returns 401 HTTP Response if the user lacks the necessary role, else calls
 *          next() to continue to request
 */
const requireRole = (roles: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isUnauthenticated() || !hasRole(req.user, roles)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  next();
};

// Requires a user to have an account
const requireRegistered = requireRole([
  rolesEnum.TBD,
  rolesEnum.CONTRIBUTOR,
  rolesEnum.STAFF,
  rolesEnum.ADMIN,
]);

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

export { requireRegistered, requireContributor, requireStaff, requireAdmin };

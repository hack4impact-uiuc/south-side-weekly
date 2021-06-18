import { Request, Response, NextFunction } from 'express';
import { hasRole, allRoles } from '../utils/auth-utils';

/**
 * Middleware to prevent users that aren't registered or don't have a
 * specified role from completing requests
 *
 * @param roles the set of roles allowed to make the given request
 * @returns 401 HTTP Response if the user lacks the necessary role, else calls
 *          next() to continue to request
 */
const requireRole = (roles: typeof allRoles) => (
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
const requireRegistered = requireRole(allRoles);

// Requires a user to have at least Contributor status
const requireContributor = requireRole(allRoles.slice(1));

// Requires a user to have at least Staff status
const requireStaff = requireRole(allRoles.slice(2));

// Requires a user to have Admin status
const requireAdmin = requireRole(allRoles.slice(3));

export { requireRegistered, requireContributor, requireStaff, requireAdmin };

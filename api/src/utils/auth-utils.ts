import { rolesEnum } from '../utils/enums';
import { SessionUser } from '../utils/helpers';

/**
 * Determines whether or not a user has the minimum level role required
 * (e.g. Admin has same role functionality as Contributor)
 *
 * @param user the user to check
 * @param roles the list of roles a user must have one of in order to have a role
 * @returns true if the list of roles contains the user role, else false
 */
const hasRole = (user: SessionUser, roles: string[]): boolean =>
  user && roles.includes(user.role);

/**
 * Determines if a user has contributor level access
 *
 * @param user the user to check
 * @returns true if user is contributor, staff, or admin, else false
 */
const isContributor = (user: SessionUser): boolean =>
  hasRole(user, [rolesEnum.CONTRIBUTOR, rolesEnum.STAFF, rolesEnum.ADMIN]);

/**
 * Determines if a user has staff level access
 *
 * @param user the user to check
 * @returns true if user is staff or admin, else false
 */
const isStaff = (user: SessionUser): boolean =>
  hasRole(user, [rolesEnum.STAFF, rolesEnum.ADMIN]);

/**
 * Determines if a user has admin level access
 *
 * @param user the user to check
 * @returns true if uesr is admin, else false
 */
const isAdmin = (user: SessionUser): boolean =>
  hasRole(user, [rolesEnum.ADMIN]);

export { hasRole, isContributor, isStaff, isAdmin };

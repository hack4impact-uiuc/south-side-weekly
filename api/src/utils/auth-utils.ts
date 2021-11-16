import { IUser } from 'ssw-common';

import { onboardingStatusEnum, rolesEnum } from '../utils/enums';

/**
 * Determines whether or not a user has the minimum level role required
 * (e.g. Admin has same role functionality as Contributor)
 *
 * @param user the user to check
 * @param roles the list of roles a user must have one of in order to have a role
 * @param requireApproved whether or not their role is required to be approved, default true
 * @returns true if the list of roles contains the user role, else false
 */
const hasRole = (
  user: IUser,
  roles: string[],
  requireApproved = true,
): boolean =>
  user &&
  roles.includes(user.role) &&
  (user.onboardingStatus === onboardingStatusEnum.ONBOARDED ||
    !requireApproved);

/**
 * Determines if a user has contributor level access
 *
 * @param user the user to check
 * @returns true if user is contributor, staff, or admin, else false
 */
const isContributor = (user: IUser): boolean =>
  hasRole(user, [rolesEnum.CONTRIBUTOR, rolesEnum.STAFF, rolesEnum.ADMIN]);

/**
 * Determines if a user has staff level access
 *
 * @param user the user to check
 * @returns true if user is staff or admin, else false
 */
const isStaff = (user: IUser): boolean =>
  hasRole(user, [rolesEnum.STAFF, rolesEnum.ADMIN]);

/**
 * Determines if a user has admin level access
 *
 * @param user the user to check
 * @returns true if uesr is admin, else false
 */
const isAdmin = (user: IUser): boolean => hasRole(user, [rolesEnum.ADMIN]);

/**
 * Determines if a user has been onboarded
 *
 * @param user the user to check
 * @returns true if uesr is onboarded, else false
 */
const isOnboarded = (user: IUser): boolean =>
  user.onboardingStatus === onboardingStatusEnum.ONBOARDED;

export { hasRole, isContributor, isStaff, isAdmin, isOnboarded };

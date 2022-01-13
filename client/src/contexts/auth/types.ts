import { BasePopulatedUser } from 'ssw-common';

export interface IAuthContext {
  user?: BasePopulatedUser;
  isAuthenticated: boolean;
  isContributor: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isRegistered: boolean;
  logout(): void;
  register(): void;
  isOnboarded: boolean;
}

import { IUser } from 'ssw-common';

export interface IAuthContext {
  user: IUser;
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

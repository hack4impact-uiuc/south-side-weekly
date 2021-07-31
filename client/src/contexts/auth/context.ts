import { createContext, useContext } from 'react';

import { emptyUser } from '../../utils/constants';

import { IAuthContext } from './types';

const AuthContext = createContext<IAuthContext>({
  user: emptyUser,
  isAuthenticated: false,
  isContributor: false,
  isStaff: false,
  isAdmin: false,
  isLoading: false,
  isRegistered: false,
  logout: () => void 0,
  register: () => void 0,
});

const useAuth = (): Readonly<IAuthContext> => useContext(AuthContext);

export { AuthContext, useAuth };

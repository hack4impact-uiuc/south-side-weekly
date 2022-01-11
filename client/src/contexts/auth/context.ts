import { createContext, useContext } from 'react';

import { defaultFunc } from '../../utils/helpers';

import { IAuthContext } from './types';

const initialValues = {
  isAuthenticated: false,
  isContributor: false,
  isStaff: false,
  isAdmin: false,
  isLoading: true,
  isRegistered: false,
  logout: defaultFunc,
  register: defaultFunc,
  isOnboarded: false,
};

const AuthContext = createContext<IAuthContext>(initialValues);

const useAuth = (): Readonly<IAuthContext> => useContext(AuthContext);

export { AuthContext, useAuth, initialValues };

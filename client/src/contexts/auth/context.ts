import { createContext, useContext } from 'react';

import { emptyUser } from '../../utils/constants';
import { defaultFunc } from '../../utils/helpers';

import { IAuthContext } from './types';

const initialValues = {
  user: emptyUser,
  isAuthenticated: false,
  isContributor: false,
  isStaff: false,
  isAdmin: false,
  isLoading: true,
  isRegistered: false,
  logout: defaultFunc,
  register: defaultFunc,
};

const AuthContext = createContext<IAuthContext>(initialValues);

const useAuth = (): Readonly<IAuthContext> => useContext(AuthContext);

export { AuthContext, useAuth, initialValues };

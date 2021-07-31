import React, {
  ReactElement,
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { getCurrentUser, isError, logout as clearSession } from '../../api';
import { emptyUser } from '../../utils/constants';
import { defaultFunc } from '../../utils/helpers';

import { AuthContext, useAuth } from './context';
import { IAuthContext } from './types';

const AuthProvider: FC = ({ children }): ReactElement => {
  const [auth, setAuth] = useState<IAuthContext>({
    isAuthenticated: false,
    user: emptyUser,
    isContributor: false,
    isStaff: false,
    isAdmin: false,
    isLoading: true,
    isRegistered: false,
    logout: () => void 0,
    register: () => void 0,
  });

  const logout = useCallback((): void => {
    clearSession();
    setAuth({
      user: emptyUser,
      isAuthenticated: false,
      isContributor: false,
      isStaff: false,
      isAdmin: false,
      isLoading: false,
      isRegistered: false,
      logout: logout,
      register: defaultFunc,
    });
  }, []);

  useEffect(() => {
    const loadCurrentUser = async (): Promise<void> => {
      const res = await getCurrentUser();

      if (!isError(res)) {
        const user = res.data.result;
        setAuth({
          user: user,
          isAuthenticated: true,
          isContributor: user.role === 'CONTRIBUTOR',
          isStaff: user.role === 'STAFF',
          isAdmin: user.role === 'ADMIN',
          isLoading: false,
          isRegistered: user.role !== 'TBD',
          logout: logout,
          register: loadCurrentUser,
        });
      } else {
        setAuth({
          user: emptyUser,
          isAuthenticated: false,
          isContributor: false,
          isStaff: false,
          isAdmin: false,
          isLoading: false,
          isRegistered: false,
          logout: defaultFunc,
          register: defaultFunc,
        });
      }
    };

    loadCurrentUser();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ ...auth }}>{children}</AuthContext.Provider>
  );
};

export { useAuth };
export default AuthProvider;

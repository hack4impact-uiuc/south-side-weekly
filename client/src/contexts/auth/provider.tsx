import React, {
  ReactElement,
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { getCurrentUser, isError, logout as clearSession } from '../../api';
import { emptyUser } from '../../utils/constants';

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
    logout: () => void 0,
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
      logout: logout,
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
          logout: logout,
        });
      } else {
        setAuth({
          user: emptyUser,
          isAuthenticated: false,
          isContributor: false,
          isStaff: false,
          isAdmin: false,
          isLoading: false,
          logout: logout,
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

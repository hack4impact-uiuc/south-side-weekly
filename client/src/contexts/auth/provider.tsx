import React, {
  ReactElement,
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { BasePopulatedUser } from 'ssw-common';

import { isError, logout as clearSession } from '../../api';
import { apiCall } from '../../api/request';
import { onboardingStatusEnum, rolesEnum } from '../../utils/enums';

import { AuthContext, initialValues, useAuth } from './context';
import { IAuthContext } from './types';

const AuthProvider: FC = ({ children }): ReactElement => {
  const [auth, setAuth] = useState<IAuthContext>(initialValues);

  const logout = useCallback((): void => {
    clearSession();
    setAuth({ ...initialValues, isLoading: false });
  }, []);

  useEffect(() => {
    const loadCurrentUser = async (): Promise<void> => {
      const res = await apiCall<BasePopulatedUser>({
        url: '/users/me',
        method: 'GET',
        populate: 'default',
      });

      if (!isError(res)) {
        const user = res.data.result;
        console.log(user);

        const sessionizedUser = {
          user: user,
          isAuthenticated: true,
          isContributor: user.role === rolesEnum.CONTRIBUTOR,
          isStaff: user.role === rolesEnum.STAFF,
          isAdmin: user.role === rolesEnum.ADMIN,
          isLoading: false,
          isRegistered: user.role !== 'TBD',
          logout: logout,
          register: loadCurrentUser,
          isOnboarded: user.onboardingStatus === onboardingStatusEnum.ONBOARDED,
        };

        setAuth(sessionizedUser);
      } else {
        setAuth({ ...initialValues, isLoading: false });
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

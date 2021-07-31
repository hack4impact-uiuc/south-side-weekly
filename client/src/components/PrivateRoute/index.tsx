import React, { FC, useEffect } from 'react';
import { Route, RouteProps, useHistory, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useAuth, useForm } from '../../contexts';

const PrivateRoute: FC<RouteProps> = ({ ...routeProps }) => {
  const { isAuthenticated, isLoading, isRegistered } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { firstLogin } = useForm();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      history.push('/login');
    } else if (!isLoading && !isRegistered) {
      history.push('/join');
    } else if (
      !isLoading &&
      isRegistered &&
      !firstLogin &&
      location.pathname === '/join'
    ) {
      Swal.fire({
        title: 'You have already created an account!',
        icon: 'info',
      });
      history.push('/resources');
    }
  }, [
    location.pathname,
    isLoading,
    history,
    isRegistered,
    isAuthenticated,
    firstLogin,
  ]);

  return (
    <Route
      exact={routeProps.exact}
      path={routeProps.path}
      render={(props) => React.createElement(routeProps.component!, props)}
    />
  );
};

export default PrivateRoute;

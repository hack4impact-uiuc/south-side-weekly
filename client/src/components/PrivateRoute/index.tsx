import React, { FC } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { useAuth } from '../../contexts';

const PrivateRoute: FC<RouteProps> = ({ ...routeProps }) => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      {isAuthenticated && !isLoading ? (
        <Route
          exact={routeProps.exact}
          path={routeProps.path}
          render={(props) => React.createElement(routeProps.component!, props)}
        />
      ) : (
        <>{!isLoading && !isAuthenticated && <Redirect to="/login" />}</>
      )}
    </>
  );
};

export default PrivateRoute;

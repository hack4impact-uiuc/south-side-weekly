import React, { FC, createElement } from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts';
import Page from '../Page';
import Loading from '../Loading';

const PrivateRoute: FC<RouteProps> = ({ ...routeProps }) => {
  const { isAuthenticated, isLoading, isRegistered, user } = useAuth();
  const location = useLocation();

  const canShowPage = (): boolean =>
    !isLoading && (isAuthenticated || location.pathname === '/login');

  return (
    <>
      <Loading open={isLoading} />
      {!isLoading && (
        <>
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && !isRegistered && (
            <Redirect to="/join" from={location.pathname} />
          )}
          {isAuthenticated && isRegistered && !user.hasRoleApproved && (
            <Redirect to="/resources" from={location.pathname} />
          )}
        </>
      )}
      {canShowPage() && (
        <Route
          exact={routeProps.exact}
          path={routeProps.path}
          render={(props) => {
            const page = createElement(routeProps.component!, props);
            return <Page>{page}</Page>;
          }}
        />
      )}
    </>
  );
};

export default PrivateRoute;

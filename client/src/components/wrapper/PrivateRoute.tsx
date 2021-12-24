import React, { FC, createElement, useMemo } from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts';
import { Page } from '../../layouts/page/Page';
import Loading from '../Loading';

export const PrivateRoute: FC<RouteProps> = ({ ...routeProps }) => {
  const { isAuthenticated, isLoading, isRegistered, isOnboarded } = useAuth();
  const location = useLocation();

  const canShowPage = useMemo(
    () => !isLoading && (isAuthenticated || location.pathname === '/login'),
    [isLoading, isAuthenticated, location.pathname],
  );

  if (isLoading) {
    return <Loading open={isLoading} />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  } else if (!isRegistered) {
    <Redirect to="/join" from={location.pathname} />;
  } else if (!isOnboarded) {
    return <Redirect to="/resources" from={location.pathname} />;
  }

  if (canShowPage) {
    return (
      <Route
        exact={routeProps.exact}
        path={routeProps.path}
        render={(props) => {
          const page = createElement(routeProps.component!, props);
          return <Page>{page}</Page>;
        }}
      />
    );
  }

  return <></>;
};

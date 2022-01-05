import React, { FC, createElement, useMemo, ReactElement } from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts';
import { Page } from '../../layouts/page/Page';
import Loading from '../ui/Loading';

export const PrivateRoute: FC<RouteProps> = ({
  ...routeProps
}): ReactElement => {
  const { isAuthenticated, isLoading, isRegistered, isOnboarded } = useAuth();
  const location = useLocation();

  const canShowPage = useMemo(
    () => !isLoading && (isAuthenticated || location.pathname === '/login'),
    [isLoading, isAuthenticated, location],
  );

  if (isLoading) {
    return <Loading open={isLoading} />;
  }

  if (!isAuthenticated && location.pathname !== '/login') {
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

import React, { FC, createElement, useMemo, ReactElement } from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts';
import { Page } from '../../layouts/page/Page';
import Loading from '../ui/Loading';

export const PrivateRoute: FC<RouteProps> = ({
  ...routeProps
}): ReactElement => {
  const { user, isAuthenticated, isLoading, isRegistered, isOnboarded } =
    useAuth();
  const location = useLocation();

  const canShowPage = useMemo(
    () => !isLoading && (isAuthenticated || location.pathname === '/login'),
    [isLoading, isAuthenticated, location],
  );

  console.log(
    isLoading,
    isAuthenticated,
    isRegistered,
    isOnboarded,
    user,
    canShowPage,
  );

  if (isLoading) {
    return <Loading open={isLoading} />;
  }

  if (!isOnboarded && location.pathname !== '/join') {
    return <Redirect to="/join" />;
  } else if (!isAuthenticated && location.pathname !== '/login') {
    return <Redirect to="/login" />;
  } else if (!isRegistered) {
    <Redirect to="/join" from={location.pathname} />;
  } else if (!isOnboarded && location.pathname !== '/resources') {
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

  return <>You are not authorized to view this page!</>;
};

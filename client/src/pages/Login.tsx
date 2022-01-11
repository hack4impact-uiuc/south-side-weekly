import React, { ReactElement } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { Card } from 'semantic-ui-react';

import { buildLoginEndpoint } from '../api';
import { useAuth } from '../contexts';

import './Login.scss';

const LOGIN_FAILURE_QUERY_PARAM = 'failure';
const LOGIN_URL = buildLoginEndpoint('auth/login');

const Login = (): ReactElement => {
  const { isLoading, isAuthenticated, isRegistered } = useAuth();
  // Builds on useLocation to parse the query string for you.
  const loginFailed = new URLSearchParams(useLocation().search).get(
    LOGIN_FAILURE_QUERY_PARAM,
  );

  if (!isLoading && isAuthenticated) {
    const path = isRegistered ? '/resources' : '/join';

    return <Redirect to={path} />;
  }

  return (
    <div className="login-wrapper">
      <div className="card-wrapper">
        <Card>
          <Card.Header>
            <h1>
              South Side Weekly <br /> Contributor Hub
            </h1>
          </Card.Header>
          <Card.Content>
            <a href={LOGIN_URL} className="btn">
              Continue with Google
            </a>
          </Card.Content>
        </Card>
      </div>
      {loginFailed && <p>Login failed!</p>}
    </div>
  );
};

export default Login;

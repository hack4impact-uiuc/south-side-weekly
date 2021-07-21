import React, { ReactElement } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Card } from 'semantic-ui-react';

import { buildURI } from '../../api';
import { FRONTEND_BASE_URL } from '../../api/urls';
import { useAuth } from '../../contexts';
import './styles.scss';

const LOGIN_FAILURE_QUERY_PARAM = 'failure';
const LOGIN_URL = buildURI(
  'auth/login',
  `${FRONTEND_BASE_URL}/login`,
  `${FRONTEND_BASE_URL}/login?${LOGIN_FAILURE_QUERY_PARAM}=1`,
);

const Login = (): ReactElement => {
  const { isLoading, isAuthenticated, isRegistered } = useAuth();
  const history = useHistory();

  // Builds on useLocation to parse the query string for you.
  const loginFailed = new URLSearchParams(useLocation().search).get(
    LOGIN_FAILURE_QUERY_PARAM,
  );

  const login = (): Window => window.open(LOGIN_URL, '_self')!;

  if (!isLoading && isAuthenticated) {
    const path = isRegistered ? '/resources' : '/join';
    history.push(path);
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
            <Button disabled={isLoading} onClick={login} className="btn">
              Continue with Google
            </Button>
          </Card.Content>
        </Card>
      </div>
      {loginFailed && <p>Login failed!</p>}
    </div>
  );
};

export default Login;

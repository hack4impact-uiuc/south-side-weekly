import React, { ReactElement } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';

import { Header } from '../../components';
import { buildURI } from '../../api';
import { FRONTEND_BASE_URL } from '../../api/urls';
import { rolesEnum } from '../../utils/enums';
import { useAuth } from '../../contexts';
import './styles.css';

const LOGIN_FAILURE_QUERY_PARAM = 'failure';

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

const Login = (): ReactElement => {
  const { user, isLoading, isAuthenticated } = useAuth();

  const loginFailed = useQuery().get(LOGIN_FAILURE_QUERY_PARAM);

  const returnRedirect = (): ReactElement => {
    if (user.role === rolesEnum.TBD) {
      return <Redirect to="/join" />;
    }
    return <Redirect to="/resources" />;
  };

  return (
    <>
      {isLoading || !isAuthenticated ? (
        <div className="login-wrapper">
          <Header />
          {isLoading ? (
            <div className="loader-wrapper">
              <Loader type="Oval" color="#3D4F91" height={50} width={50} />
            </div>
          ) : (
            <>
              <h1>SSW Dashboard</h1>
              <div className="btn-group">
                <div className="btn-wrapper">
                  <a
                    href={buildURI(
                      'auth/login',
                      `${FRONTEND_BASE_URL}/login`,
                      `${FRONTEND_BASE_URL}/login?${LOGIN_FAILURE_QUERY_PARAM}=1`,
                    )}
                  >
                    <Button className="btn">New User</Button>
                  </a>
                </div>
                <div className="btn-wrapper">
                  <a
                    href={buildURI(
                      'auth/login',
                      `${FRONTEND_BASE_URL}/login`,
                      `${FRONTEND_BASE_URL}/login?${LOGIN_FAILURE_QUERY_PARAM}=1`,
                    )}
                  >
                    <Button className="btn">Returning User</Button>
                  </a>
                </div>
              </div>
            </>
          )}
          {loginFailed && <p>Login failed!</p>}
        </div>
      ) : (
        returnRedirect()
      )}
    </>
  );
};

export default Login;

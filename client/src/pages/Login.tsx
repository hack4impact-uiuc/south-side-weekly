import React, { useEffect, useState, ReactElement } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';

import buildURI from '../utils/apiHelpers';
import { BASE_URL, FRONTEND_BASE_URL } from '../utils/apiWrapper';
import { rolesEnum } from '../utils/enums';
import Logo from '../assets/ssw-form-header.png';

const LOGIN_FAILURE_QUERY_PARAM = 'failure';

import '../css/Login.css';

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

function Login(): ReactElement {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState({ role: '' });

  const checkLoggedIn = (): void => {
    const requestString = `${BASE_URL}/auth/currentuser`;
    axios
      .get(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      })
      .then((res) => {
        setAuthed(res.data.success);
        if (res.data.success) {
          console.log(res.data.result);
          setUser(res.data.result);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    checkLoggedIn();
  }, [authed]);

  const loginFailed = useQuery().get(LOGIN_FAILURE_QUERY_PARAM);

  const returnRedirect = (): ReactElement => {
    console.log(user);
    if (user.role === rolesEnum.TBD) {
      return <Redirect to="/join" />;
    }
    return <Redirect to="/resources" />;
  };

  return (
    <>
      {loading || !authed ? (
        <div className="login-wrapper">
          <div className="logo-header">
            <img className="logo" alt="SSW Logo" src={Logo} />
          </div>
          {loading ? (
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
}

export default Login;

import React, { ReactElement, useState } from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import { Redirect } from 'react-router';

import { BASE_URL } from '../utils/apiWrapper';
import Logo from '../assets/ssw-form-header.png';

import '../css/Home.css';

function Home(): ReactElement {
  const [loggedOut, setLoggedOut] = useState(false);
  const logout = (): void => {
    const requestString = `${BASE_URL}/auth/logout`;
    axios
      .post(requestString, {
        headers: {
          'Content-Type': 'application/JSON',
        },
      })
      .then((res) => {
        console.log(res);
        setLoggedOut(true);
      })
      .catch((err) => {
        console.error(err);
        setLoggedOut(true);
      });
  };

  return (
    <>
      {' '}
      {!loggedOut ? (
        <div className="home-wrapper">
          <div className="logo-header">
            <img className="logo" alt="SSW Logo" src={Logo} />
          </div>
          <h1>SSW Dashboard</h1>
          <div className="btn-group">
            <div className="btn-wrapper">
              <Button onClick={logout} className="btn">
                Logout
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
}

export default Home;

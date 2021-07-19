import React, { ReactElement } from 'react';
import { Button } from 'semantic-ui-react';

import { Header } from '../../components';
import './styles.css';
import { useAuth } from '../../contexts';

function Home(): ReactElement {
  const { logout } = useAuth();

  return (
    <div className="home-wrapper">
      <Header />

      <h1>SSW Dashboard</h1>
      <div className="btn-group">
        <div className="btn-wrapper">
          <Button onClick={logout} className="btn">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;

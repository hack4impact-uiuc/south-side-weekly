import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import './Navbar.scss';
import ProfileSelect from '../../components/select/ProfileSelect';
import { AuthView } from '../../components/wrapper/AuthView';

const Navbar = (): ReactElement => (
  <Menu attached="top" className="navbar" borderless size="large">
    <Menu.Item className="header">
      <h2>South Side Weekly</h2>
    </Menu.Item>
    <Menu.Menu position="right">
      <AuthView view="isOnboarded">
        <Menu.Item as={NavLink} to="/home" name="Home" />
        <Menu.Item as={NavLink} to="/pitches" name="Pitch Doc" />
        <AuthView view="isAdmin">
          <Menu.Item as={NavLink} to="/issues" name="Issues" />
        </AuthView>
        <Menu.Item as={NavLink} to="/users" name="Directory" />
      </AuthView>
      <Menu.Item as={NavLink} to="/resources" name="Resources" />
      <Menu.Item className="profile">
        <ProfileSelect />
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);

export { Navbar };

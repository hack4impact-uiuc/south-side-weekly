import React, { ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import ProfileDropdown from '../Dropdowns/Profile';
import ApprovedView from '../Auth/ApprovedView';
import { useAuth } from '../../contexts';

import './styles.scss';

const Navbar = (): ReactElement => {
  const { user } = useAuth();

  return (
    <Menu attached="top" className="navbar" borderless size="large">
      <Menu.Item className="header" as={user.hasRoleApproved && Link} to="/homepage">
        <h2>South Side Weekly</h2>
      </Menu.Item>
      <Menu.Menu position="right">
        <ApprovedView>
          <Menu.Item as={NavLink} to="/pitches" name="Pitch Doc" />
          <Menu.Item as={NavLink} to="/users" name="Directory" />
        </ApprovedView>
        <Menu.Item as={NavLink} to="/resources" name="Resources" />
        <Menu.Item className="profile">
          <ProfileDropdown />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Navbar;

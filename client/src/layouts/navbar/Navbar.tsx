import React, { ReactElement, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Button, Sidebar, Segment, Transition } from 'semantic-ui-react';
import toast from 'react-hot-toast';

import ProfileSelect from '../../components/select/ProfileSelect';
import { AuthView } from '../../components/wrapper/AuthView';
import { useAuth } from '../../contexts';
import { apiCall, isError } from '../../api';

import './Navbar.scss';

const DesktopNavbarItems = (): ReactElement => (
  <div id="desktop-wrapper">
    <AuthView view="isOnboarded">
      <Menu.Item as={NavLink} to="/home" name="Home" />
      <Menu.Item as={NavLink} to="/pitches" name="Pitch Doc" />
      <Menu.Item as={NavLink} to="/issues" name="Issues" />
      <Menu.Item as={NavLink} to="/users" name="Directory" />
    </AuthView>
    <Menu.Item as={NavLink} to="/resources" name="Resources" />
    <Menu.Item className="profile">
      <ProfileSelect />
    </Menu.Item>
  </div>
);

const MobileNavbarItems = (): ReactElement => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = async (): Promise<void> => {
    const res = await apiCall({
      url: '/auth/logout',
      method: 'GET',
    });

    if (!isError(res)) {
      window.location.reload();
    } else {
      toast.error('Error logging out');
    }
  };

  return (
    <div id="mobile-wrapper">
      <Button
        size="massive"
        id="open-sidebar"
        icon="bars"
        onClick={toggleSidebar}
      />
      <Transition visible={isSidebarOpen} animation="slide left" duration={500}>
        <Sidebar
          className="sidebar"
          as={Segment}
          animation="overlay"
          direction="right"
          visible={isSidebarOpen}
        >
          <Button icon="close" onClick={toggleSidebar} />
          <Menu vertical>
            <AuthView view="isOnboarded">
              <Menu.Item as={NavLink} to="/home" name="Home" />
              <Menu.Item as={NavLink} to="/pitches" name="Pitch Doc" />
              <AuthView view="isAdmin">
                <Menu.Item as={NavLink} to="/issues" name="Issues" />
              </AuthView>
              <Menu.Item as={NavLink} to="/users" name="Directory" />
            </AuthView>
            <Menu.Item as={NavLink} to="/resources" name="Resources" />
            <Menu.Item
              as={NavLink}
              to={`/profile/${user?._id}`}
              name="Profile"
            />
            <Menu.Item to="/login" onClick={logout} name="Logout" />
          </Menu>
        </Sidebar>
      </Transition>
    </div>
  );
};

const Navbar = (): ReactElement => (
  <Menu attached="top" className="navbar" borderless size="large">
    <Menu.Item className="header">
      <h2 id="nav-title">South Side Weekly</h2>
    </Menu.Item>
    <Menu.Menu position="right">
      <MobileNavbarItems />
      <DesktopNavbarItems />
    </Menu.Menu>
  </Menu>
);

export { Navbar };

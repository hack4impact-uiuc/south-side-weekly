import React, { ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Image } from 'semantic-ui-react';

import { pages } from '../../utils/enums';
import './styles.css';
import { getUserProfilePic } from '../../utils/helpers';
import { useAuth } from '../../contexts';

interface IProps {
  currentPage: string;
}

function Sidebar({ currentPage }: IProps): ReactElement {
  const { user, logout } = useAuth();

  useEffect(() => {
    switch (currentPage) {
      case pages.HOME:
        window.document.getElementById('home')!.classList.add('active');
        break;
      case pages.PROFILE:
        window.document.getElementById('profile')!.classList.add('active');
        break;
      case pages.PITCHES:
        window.document.getElementById('pitches')!.classList.add('active');
        break;
      case pages.RESOURCES:
        window.document.getElementById('resources')!.classList.add('active');
        break;
      case pages.USERS:
        window.document.getElementById('users')!.classList.add('active');
        break;
    }
  });

  return (
    <div className="sidebar">
      <div className="profile-pic">
        <Image src={getUserProfilePic(user)} alt="IMG-5592" />
      </div>
      <div className="vertical-nav">
        <Link to="/homepage">
          <div id="home" className="nav-link">
            <Icon className="icon" name="home" size="large" />
            <div className="icon-text">Home</div>
          </div>
        </Link>
        <Link to={`/profile/${user._id}`}>
          <div id="profile" className="nav-link">
            <Icon className="icon" name="user" size="large" />
            <div className="icon-text">Profile</div>
          </div>
        </Link>
        <Link to="/pitches">
          <div id="pitches" className="nav-link">
            <Icon className="icon" name="clipboard" size="large" />
            <div className="icon-text">Pitches</div>
          </div>
        </Link>
        <Link to="/resources">
          <div id="resources" className="nav-link">
            <Icon className="icon" name="book" size="large" />
            <div className="icon-text">Resources</div>
          </div>
        </Link>
        <Link to="/users">
          <div id="users" className="nav-link">
            <Icon className="icon" name="users" size="large" />
            <div className="icon-text">Users</div>
          </div>
        </Link>
        <Link onClick={logout} to="/login">
          <div id="logout" className="nav-link">
            <Icon className="icon" name="log out" size="large" />
            <div className="icon-text">Logout</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;

import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import Pfp from '../assets/pfp.svg';
import Home from '../assets/home.svg';
import Person from '../assets/person.svg';
import Pitch from '../assets/pitch.svg';
import Library from '../assets/library.svg';
import People from '../assets/people.svg';

import '../css/Sidebar.css';

function Sidebar(): ReactElement {
  return (
    <div className="sidebar">
      <div className="profile-pic">
        <img src={Pfp} alt="IMG-5592" />
      </div>
      <div className="vertical-nav">
        <div className="nav-link">
          <Link to="/homepage">
            <img src={Home} alt="home" />
          </Link>
        </div>
        <div className="nav-link">
          <Link to="/profile">
            <img src={Person} alt="person" />
          </Link>
        </div>
        <div className="nav-link">
          <img src={Pitch} alt="pitch" />
        </div>
        <div className="nav-link">
          <Link to="/resources">
            <img src={Library} alt="library" />
          </Link>
        </div>
        <div className="nav-link">
          <img src={People} alt="people" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

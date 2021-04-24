import React, { ReactElement } from 'react';

import Home from '../../assets/home.svg';
import Person from '../../assets/person.svg';
import Pitch from '../../assets/pitch.svg';
import Library from '../../assets/library.svg';
import People from '../../assets/people.svg';

import '../../css/Sidebar.css';

// Temporary profile pic of Mustafa
const profilePicPath =
  'https://ca.slack-edge.com/T6VL1BSEA-U01M1TTQ1TQ-09478f1b309f-512';

function Sidebar(): ReactElement {
  return (
    <div className="sidebar">
      <div className="profile-pic">
        <img src={profilePicPath} alt="IMG-5592" />
      </div>
      <div className="vertical-nav">
        <div className="nav-link">
          <img src={Home} alt="home" />
        </div>
        <div className="nav-link">
          <img src={Person} alt="person" />
        </div>
        <div className="nav-link">
          <img src={Pitch} alt="pitch" />
        </div>
        <div className="nav-link">
          <img src={Library} alt="library" />
        </div>
        <div className="nav-link">
          <img src={People} alt="people" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

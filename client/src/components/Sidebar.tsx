import React, { ReactElement } from 'react';

import '../css/Sidebar.css';

function Sidebar(): ReactElement {
  return (
    <div className="sidebar">
      <div className="profile-pic">
        <img src="https://i.ibb.co/RPcYkT7/IMG-5592.jpg" alt="IMG-5592" />
      </div>
      <div className="vertical-nav">
        <div className="nav-link">
          <div className="icon">Home</div>
        </div>
        <div className="nav-link active">
          <div className="icon">Profile</div>
        </div>
        <div className="nav-link">
          <div className="icon">Edit</div>
        </div>
        <div className="nav-link">
          <div className="icon">Stats</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

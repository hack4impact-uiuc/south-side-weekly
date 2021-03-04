import React, { ReactElement } from 'react';

import '../css/Sidebar.css';

type SidebarProps = {
  firstName: string;
};

function Sidebar({ firstName }: SidebarProps): ReactElement {
  return (
    <div className="sidebar">
      <div className="profile-pic"></div>
      {firstName}
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

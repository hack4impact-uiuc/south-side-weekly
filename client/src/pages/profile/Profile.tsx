import React, { ReactElement } from 'react';

import Sidebar from '../../components/Sidebar';
import Logo from '../../assets/ssw-form-header.png'

import '../../css/Profile.css';

function Profile(): ReactElement {
  
  return (
  <>
    <Sidebar />
    <div className="logo-header">
      <img className="logo" alt="SSW Logo" src={Logo} />
    </div>
    <div className="section">
      <div className="section-title">
        <h3>Basic Information</h3>
      </div>
    </div>
  </>
  );
}

export default Profile;

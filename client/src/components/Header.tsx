import React, { ReactElement } from 'react';

import Logo from '../assets/ssw-form-header.png';

function Header(): ReactElement {
  return (
    <div className="logo-header">
      <img className="logo" alt="SSW Logo" src={Logo} />
    </div>
  );
}

export default Header;

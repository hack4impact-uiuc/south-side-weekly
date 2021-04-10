import React, { ReactElement } from 'react';

import Logo from '../assets/ssw-form-header.png';

interface HeaderProps {
  large: boolean;
}

function Header(props: HeaderProps): ReactElement {
  const { large } = props;
  return (
    <div className="logo-header">
      <img
        className={large ? 'logo' : 'logo-small'}
        alt="SSW Logo"
        src={Logo}
      />
    </div>
  );
}

export default Header;

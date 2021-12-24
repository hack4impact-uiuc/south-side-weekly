import React, { FC, ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

import { Navbar } from '../navbar/Navbar';

import './Page.scss';

const Page: FC = ({ children }): ReactElement => {
  const location = useLocation();

  const canShowNavbar = (): boolean =>
    location.pathname !== '/join' && location.pathname !== '/login';

  return (
    <div className="page-wrapper">
      {canShowNavbar() && <Navbar />}
      <div className={`page-content ${canShowNavbar() && 'space'}`}>
        {children}
      </div>
    </div>
  );
};

export { Page };

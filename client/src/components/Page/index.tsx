import React, { FC, ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from '../Navbar';

import './styles.scss';

const Page: FC = ({ children }): ReactElement => {
  const location = useLocation();

  const isViewingWizard = (): boolean => location.pathname === '/join';

  return (
    <div className="page-wrapper">
      {!isViewingWizard() && <Navbar />}
      <div className={`page-content ${!isViewingWizard() && 'space'}`}>
        {children}
      </div>
    </div>
  );
};

export default Page;

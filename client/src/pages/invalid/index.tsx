import React, { ReactElement } from 'react';
import { Image } from 'semantic-ui-react';

import { Sidebar } from '../../components';
import { pages } from '../../utils/enums';
import Error from '../../assets/404-error.png';
import './styles.scss';

const NotFound = (): ReactElement => (
  <>
    <Sidebar currentPage={pages.HOME} />
    <div className="not-found-page">
      <Image size="medium" src={Error} alt="Page not found. Error 404" />
    </div>
  </>
);

export default NotFound;

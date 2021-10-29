import React, { ReactElement } from 'react';
import { Image } from 'semantic-ui-react';
import TeamModal from '../../components/Modals/EditTeam';

import Error from '../../assets/404-error.png';
import './styles.scss';

const NotFound = (): ReactElement => (
  <div className="not-found-page">
    <Image size="medium" src={Error} alt="Page not found. Error 404" />
    <TeamModal />
  </div>
);

export default NotFound;

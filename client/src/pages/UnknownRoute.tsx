import React, { ReactElement } from 'react';
import { Image } from 'semantic-ui-react';

import Error from '../assets/404-error.png';

import './UnknownRoute.scss';

const UnknownRoute = (): ReactElement => (
  <div className="not-found-page">
    <Image size="medium" src={Error} alt="Page not found. Error 404" />
  </div>
);

export default UnknownRoute;

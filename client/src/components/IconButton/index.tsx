import React, { FC } from 'react';

import './styles.scss';

const IconButton: FC = ({ children }) => (
  <span className="icon-button-wrapper">{children}</span>
);

export default IconButton;

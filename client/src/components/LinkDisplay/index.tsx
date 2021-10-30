import React, { FC, ReactElement } from 'react';
import { Icon } from 'semantic-ui-react';

import './styles.scss';

interface LinkDisplayProps {
  href: string;
}

const LinkDisplay: FC<LinkDisplayProps> = ({ href }) => (
  <a href={href} className="link-display-link">
    <Icon name="linkify" />
    Link
  </a>
);

export default LinkDisplay;

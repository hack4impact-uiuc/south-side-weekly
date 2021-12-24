import React, { FC } from 'react';
import { Icon } from 'semantic-ui-react';

import './LinkDisplayButton.scss';

interface LinkDisplayProps {
  href: string;
}

export const LinkDisplay: FC<LinkDisplayProps> = ({ href }) => (
  <a href={href} className="link-display-link">
    <Icon name="linkify" />
    Link
  </a>
);

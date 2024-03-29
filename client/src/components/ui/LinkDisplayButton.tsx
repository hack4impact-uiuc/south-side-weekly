import React, { FC } from 'react';
import { Icon } from 'semantic-ui-react';

import './LinkDisplayButton.scss';

interface LinkDisplayProps {
  href: string;
  [key: string]: any;
}

export const LinkDisplay: FC<LinkDisplayProps> = ({ href, ...rest }) => (
  <a {...rest} href={href} className="link-display-link">
    <Icon name="linkify" />
    Link
  </a>
);

import React, { ReactElement, FC } from 'react';
import { Icon, SemanticICONS } from 'semantic-ui-react';

import './IconLabel.scss';

interface SocialsInputProps {
  icon: SemanticICONS;
  value: string;
  viewable: boolean;
}

export const IconLabel: FC<SocialsInputProps> = ({
  icon,
  value,
  viewable,
}): ReactElement => {
  if (!viewable) {
    return <></>;
  }

  const linkify = (icon: SemanticICONS, link: string): ReactElement => {
    if (icon.includes('mail')) {
      return <a href={`mailto:${link}`}>{link}</a>;
    } else if (icon === 'linkedin' || icon === 'globe' || icon === 'twitter') {
      return (
        <a href={link} rel="noreferrer" target="_blank">
          {link}
        </a>
      );
    } else if (icon.includes('phone')) {
      return <a href={`tel:${link}`}>{link}</a>;
    }

    return <span>{link}</span>;
  };

  return (
    <div className="social-input">
      <div>
        <Icon size="small" name={icon} />
      </div>
      <div>{linkify(icon, value)}</div>
    </div>
  );
};

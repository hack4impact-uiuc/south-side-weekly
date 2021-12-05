import React, { ReactElement, FC } from 'react';
import { Icon, SemanticICONS } from 'semantic-ui-react';

import './styles.scss';
import { ISocialsInput } from './types';

const SocialsInput: FC<ISocialsInput> = ({
  icon,
  value,
  viewable,
}): ReactElement => {
  /**
   * Determines if to represent the social input as a link based on its icon
   *
   * @param icon the Semantic UI icon for the input
   * @param link the potential link
   * @returns an element with the proper wrapper tag
   */
  const linkify = (icon: SemanticICONS, link: string): ReactElement => {
    if (icon.includes('mail')) {
      return <a href={`mailto:${link}`}>{link}</a>;
    } else if (icon === 'linkedin' || icon === 'globe' || icon === 'twitter') {
      return <a href={link}>{link}</a>;
    } else if (icon.includes('phone')) {
      return <a href={`tel:${link}`}>{link}</a>;
    }

    return <span>{link}</span>;
  };

  return (
    <>
      {viewable && (
        <div className="social-input">
          <Icon size="small" name={icon} />

          {linkify(icon, value)}
        </div>
      )}
    </>
  );
};

export default SocialsInput;

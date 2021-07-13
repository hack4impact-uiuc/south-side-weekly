import React, { ReactElement, FC } from 'react';
import { Grid, Icon, Input, SemanticICONS } from 'semantic-ui-react';

import './styles.css';
import { ISocialsInput } from './types';

const SocialsInput: FC<ISocialsInput> = ({
  icon,
  value,
  readOnly,
  onChange,
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
        <Grid className="social-input" columns="equal">
          <Grid.Column className="col" width={2}>
            <Icon size="big" name={icon} />
          </Grid.Column>
          <Grid.Column className="col">
            <Input
              size="big"
              className="input"
              fluid
              readOnly={readOnly}
              transparent
              onChange={onChange}
            >
              {linkify(icon, value)}
            </Input>
          </Grid.Column>
        </Grid>
      )}
    </>
  );
};

export default SocialsInput;

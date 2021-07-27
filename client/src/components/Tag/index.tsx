import { toLower, toString } from 'lodash';
import React, { FC, ReactElement } from 'react';
import { Label, LabelProps } from 'semantic-ui-react';

import { titleCase } from '../../utils/helpers';

import './styles.scss';

const Tag: FC<LabelProps> = ({
  content,
  size = 'large',
  ...rest
}): ReactElement => {
  const toClassName = (str: string): string =>
    toLower(str).split(' ').join('-');

  const getClassName = (): string => {
    const base = 'interest-team-label';
    const color = toClassName(toString(content));
    const props = rest.className;

    return `${base} ${color} ${props}`;
  };

  return (
    <Label
      {...rest}
      content={titleCase(toString(content))}
      size={size}
      className={getClassName()}
    />
  );
};

export default Tag;

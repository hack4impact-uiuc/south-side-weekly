import { toLower, toString } from 'lodash';
import React, { FC, ReactElement, useMemo } from 'react';
import { Label, LabelProps } from 'semantic-ui-react';
import cn from 'classnames';

import { titleCase } from '../../utils/helpers';

import './FieldTag.scss';

interface FieldTagProps extends LabelProps {
  name?: string | undefined;
  hexcode?: string | undefined;
}

export const FieldTag: FC<FieldTagProps> = ({
  name = '',
  hexcode = 'transparent',
  content,
  size = 'large',
  ...rest
}): ReactElement => {
  const toClassName = (str: string): string => {
    str = toLower(str);

    let split = str.split(' ');

    if (split.length === 1) {
      split = str.split('_');
    }

    return `${split.join('-')}-tag-color`;
  };

  const className = useMemo(() => {
    const storedBackground =
      hexcode === undefined ? '' : toClassName(toString(content));

    return cn('field-tag-label', storedBackground, rest.className);
  }, [hexcode, content, rest.className]);

  return (
    <Label
      {...rest}
      content={name || titleCase(toString(content))}
      size={size}
      style={{ backgroundColor: hexcode }}
      className={className}
    />
  );
};

export default FieldTag;

import { toLower, toString } from 'lodash';
import React, { FC, ReactElement } from 'react';
import { Label, LabelProps } from 'semantic-ui-react';

import { classNames, titleCase } from '../../utils/helpers';

import './styles.scss';

//TODO: Remove this once flexible interests is added
interface FieldTagProps extends LabelProps {
  name?: string | undefined;
  hexcode?: string | undefined;
}

const FieldTag: FC<FieldTagProps> = ({
  name = '',
  hexcode = 'transparent',
  content,
  size = 'large',
  ...rest
}): ReactElement => {
  const toClassName = (str: string): string => {
    if (name !== '') {
      return '';
    }

    str = toLower(str);

    let split = str.split(' ');

    if (split.length === 1) {
      split = str.split('_');
    }

    return `${split.join('-')}-tag-color`;
  };

  const getFullClassName = (): string => {
    const storedBackground =
      hexcode === undefined ? '' : toClassName(toString(content));

    return classNames('field-tag-label', storedBackground, rest.className);
  };

  return (
    <Label
      {...rest}
      content={name || titleCase(toString(content))}
      size={size}
      style={{ backgroundColor: hexcode }}
      className={getFullClassName()}
    />
  );
};

export default FieldTag;

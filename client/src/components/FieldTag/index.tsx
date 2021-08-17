import { toLower, toString } from 'lodash';
import React, { FC, ReactElement } from 'react';
import { Label, LabelProps } from 'semantic-ui-react';

import { classNames, titleCase } from '../../utils/helpers';

import './styles.scss';

const FieldTag: FC<LabelProps> = ({
  content,
  size = 'large',
  ...rest
}): ReactElement => {
  const toClassName = (str: string): string =>
    toLower(str).split(' ').join('-');

  return (
    <Label
      {...rest}
      content={titleCase(toString(content))}
      size={size}
      className={classNames([
        'interest-team-label',
        toClassName(toString(content)),
        rest.className,
      ])}
    />
  );
};

export default FieldTag;

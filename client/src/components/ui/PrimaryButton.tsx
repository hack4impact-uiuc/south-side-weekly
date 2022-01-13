import React, { FC, ReactElement } from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';
import cn from 'classnames';

import './PrimaryButton.scss';

export const PrimaryButton: FC<ButtonProps> = ({
  className,
  ...rest
}): ReactElement => (
  <Button {...rest} className={cn('primary-btn', className)} />
);

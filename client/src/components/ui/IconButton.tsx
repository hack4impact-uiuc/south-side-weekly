import React, { FC } from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';
import cn from 'classnames';

export const IconButton: FC<ButtonProps> = ({
  children,
  className,
  ...rest
}) => (
  <Button {...rest} className={cn('icon-btn', className)}>
    {children}
  </Button>
);

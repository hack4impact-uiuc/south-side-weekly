import React, { FC, ReactElement } from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';
import cn from 'classnames';

import './SecondaryButton.scss';

interface SecondaryButtonProps extends ButtonProps {
  border?: boolean;
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  className,
  border,
  ...rest
}): ReactElement => (
  <Button
    {...rest}
    className={cn('secondary-btn', border && 'bordered', className)}
  />
);

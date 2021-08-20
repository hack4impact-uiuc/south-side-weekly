import React, { FC, ReactElement } from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';

import { useWizard } from '../../../contexts';
import { classNames } from '../../../utils/helpers';

import './styles.scss';

interface SubmitButtonProps extends ButtonProps {
  action: 'complete' | 'next';
}

const SubmitButton: FC<SubmitButtonProps> = ({
  action,
  ...rest
}): ReactElement => {
  const { currentPage } = useWizard();

  return (
    <Button
      className={classNames('wizard-submit', rest.className)}
      icon={action === 'next' ? 'arrow right' : 'check'}
      circular
      size="massive"
      type="submit"
      form={`onboard-${currentPage}`}
      {...rest}
    />
  );
};

export default SubmitButton;

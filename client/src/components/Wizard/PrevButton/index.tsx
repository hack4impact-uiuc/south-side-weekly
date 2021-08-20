import React, { FC, ReactElement } from 'react';
import { Button } from 'semantic-ui-react';

import { useWizard } from '../../../contexts';

const PrevButton: FC = (): ReactElement => {
  const { currentPage, jumpTo } = useWizard();

  return (
    <Button
      className="go-back"
      icon="arrow left"
      circular
      size="massive"
      onClick={() => jumpTo(currentPage - 1)}
    />
  );
};

export default PrevButton;

import React, { useState, useEffect, FC, ReactElement } from 'react';
import { Message } from 'semantic-ui-react';

import { apiCall } from '../../api';
import { useAuth } from '../../contexts';

interface Props {
  page: string;
  content: string;
}

const Walkthrough: FC<Props> = ({ page, content }): ReactElement => {
  const { user, register } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user!.visitedPages.includes(page)) {
      setVisible(true);
    }
  }, [user, page]);

  const closeWalkthrough = async (): Promise<void> => {
    setVisible(false);
    await apiCall({
      url: '/users/visitPage',
      method: 'PUT',
      body: { page },
    });
    register();
  };

  if (!visible) {
    return <></>;
  }

  return (
    <Message onDismiss={closeWalkthrough} content={content} color="blue" />
  );
};

export default Walkthrough;

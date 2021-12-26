import React, { useState, useEffect, FC } from 'react';
import { Message } from 'semantic-ui-react';

import { addVisitedPage } from '../../api/user';
import { useAuth } from '../../contexts';

interface Props {
  page: string;
  content: string;
}

const Walkthrough: FC<Props> = ({ page, content }) => {
  const { user, register } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isPageVisited = (page: string): boolean => {
      const visitedPages = user!.visitedPages;

      return visitedPages.includes(page);
    };

    if (!isPageVisited(page)) {
      setVisible(true);
    }
  }, [user, page]);

  const closeWalkthrough = async (): Promise<void> => {
    setVisible(false);
    await addVisitedPage(page);
    register();
  };

  return (
    <>
      {visible && (
        <Message onDismiss={closeWalkthrough} content={content} color="blue" />
      )}
    </>
  );
};

export default Walkthrough;

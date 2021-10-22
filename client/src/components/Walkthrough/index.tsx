import React, { ReactElement, useState } from 'react';
import { Message } from 'semantic-ui-react';

import './styles.scss';

const Walkthrough = (): ReactElement => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {visible && (
        <Message
          onDismiss={() => setVisible(false)}
          header="Welcome back!"
          content="This is a special notification which you can dismiss."
        />
      )}
    </>
  );
};

export default Walkthrough;

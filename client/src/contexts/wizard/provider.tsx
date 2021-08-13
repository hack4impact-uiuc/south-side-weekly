import React, { ReactElement, FC, useState } from 'react';

import { WizardContext, useWizard, initialValues } from './context';
import { UserElements } from './types';

const WizardProvider: FC = ({ children }): ReactElement => {
  const [newUser, setNewUser] = useState(initialValues);
  const [pages, setPages] = useState(new Set<number>());

  const store = (data: UserElements): void => {
    console.log(data);
    const updated = { ...newUser };

    updated.data = { ...updated.data, ...data };
    updated.currentPage++;

    console.log(updated);

    setNewUser(updated);
    pages.add(updated.currentPage - 1);
    setPages(new Set(pages));
  };

  const jumpTo = (page: number): void => {
    setNewUser({ ...newUser, currentPage: page });
  };

  const hasSubmitted = (page: number): boolean => pages.has(page);

  return (
    <WizardContext.Provider
      value={{
        ...newUser,
        store,
        jumpTo,
        hasSubmitted,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export { useWizard };
export default WizardProvider;

import React, { ReactElement, FC, useState } from 'react';
import { BasePopulatedUser } from 'ssw-common';

import { WizardContext, useWizard, initialValues } from './context';
import { IWizardContext } from './types';

const WizardProvider: FC = ({ children }): ReactElement => {
  const [newUser, setNewUser] = useState<IWizardContext>(initialValues);
  const [pages, setPages] = useState(new Set<number>());

  const store = (data: Partial<BasePopulatedUser>): void => {
    const updated = { ...newUser, data: { ...newUser.data, ...data } };
    updated.currentPage++;

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

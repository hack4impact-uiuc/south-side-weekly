import React, { ReactElement, FC, useState } from 'react';
import { IUser } from 'ssw-common';

import { emptyUser } from '../../utils/constants';
import { defaultFunc } from '../../utils/helpers';

import { WizardContext, useForm } from './context';
import { IWizardContext } from './types';

const WizardProvider: FC = ({ children }): ReactElement => {
  const [onboardingData, setOnboardingData] = useState<IWizardContext>({
    currentPage: 0,
    formData: emptyUser,
    prevPage: defaultFunc,
    updateOnboardingData: defaultFunc,
    jumpTo: defaultFunc,
    hasSubmitted: () => false,
    firstLogin: false,
  });

  const [pages, setPages] = useState(new Set<number>());

  const updateOnboardingData = (
    formData: {
      [key: string]: IUser[keyof IUser];
    },
    goNext: boolean,
  ): void => {
    const updated = { ...onboardingData };
    updated.formData = { ...updated.formData, ...formData };
    updated.firstLogin = true;

    if (goNext) {
      updated.currentPage++;
    }

    setOnboardingData(updated);
    pages.add(updated.currentPage - 1);
    setPages(new Set(pages));
  };

  const prevPage = (): void => {
    const page = onboardingData.currentPage - 1;
    setOnboardingData({ ...onboardingData, currentPage: page });
  };

  const jumpTo = (page: number): void => {
    setOnboardingData({ ...onboardingData, currentPage: page });
  };

  const hasSubmitted = (page: number): boolean => pages.has(page);

  return (
    <WizardContext.Provider
      value={{
        ...onboardingData,
        updateOnboardingData,
        prevPage,
        jumpTo,
        hasSubmitted,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export { useForm };
export default WizardProvider;

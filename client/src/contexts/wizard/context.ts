import { createContext, useContext } from 'react';

import { defaultFunc } from '../../utils/helpers';

import { IWizardContext } from './types';

const initialValues = {
  currentPage: 0,
  jumpTo: defaultFunc,
  store: defaultFunc,
  hasSubmitted: (): boolean => true,
};

const WizardContext = createContext<IWizardContext>(initialValues);

const useWizard = (): Readonly<IWizardContext> => useContext(WizardContext);

export { WizardContext, useWizard, initialValues };

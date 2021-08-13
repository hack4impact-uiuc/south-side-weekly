import { createContext, useContext } from 'react';

import { emptyUser } from '../../utils/constants';
import { defaultFunc } from '../../utils/helpers';

import { IWizardContext } from './types';

const initialValues = {
  currentPage: 0,
  data: emptyUser,
  jumpTo: defaultFunc,
  store: defaultFunc,
  hasSubmitted: (): boolean => true,
};

const WizardContext = createContext<IWizardContext>(initialValues);

const useWizard = (): Readonly<IWizardContext> => useContext(WizardContext);

export { WizardContext, useWizard, initialValues };

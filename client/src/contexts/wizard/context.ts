import { createContext, useContext } from 'react';

import { emptyUser } from '../../utils/constants';
import { defaultFunc } from '../../utils/helpers';

import { IWizardContext } from './types';

const WizardContext = createContext<IWizardContext>({
  currentPage: 0,
  formData: emptyUser,
  prevPage: defaultFunc,
  updateOnboardingData: defaultFunc,
  jumpTo: defaultFunc,
  hasSubmitted: () => true,
  firstLogin: false,
});

const useForm = (): IWizardContext => useContext(WizardContext);

export { WizardContext, useForm };

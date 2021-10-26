import { createContext, useContext } from 'react';
import { emptyUser } from '../../utils/constants';
import { defaultFunc } from '../../utils/helpers';

import { IInterestsContext } from './types';

// initial values for the context
export const initialValues: IInterestsContext = {
  interests: [],
  fetchInterests: defaultFunc,
};

// create the context
const InterestsContext = createContext<IInterestsContext>(initialValues);

// hook to access the context
const useInterests = (): Readonly<IInterestsContext> =>
  useContext(InterestsContext);

export { InterestsContext, useInterests };

import React, {
  ReactElement,
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { IInterest } from 'ssw-common';
import { getInterests, isError } from '../../api';

import { InterestsContext, initialValues } from './context';

// Interest provider
export const InterestsProvider: FC = ({ children }): ReactElement => {
  const [interests, setInterests] = useState<IInterest[]>(
    initialValues.interests,
  );

  const fetchInterests = useCallback(async () => {
    const res = await getInterests();

    if (!isError(res)) {
      setInterests(res.data.result);
    }
  }, []);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  return (
    <InterestsContext.Provider
      value={{
        interests,
        fetchInterests,
      }}
    >
      {children}
    </InterestsContext.Provider>
  );
};

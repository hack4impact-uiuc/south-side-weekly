import React, {
  ReactElement,
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { IInterest } from 'ssw-common';

import { getInterests, isError } from '../../api';

import { InterestsContext, initialValues, useInterests } from './context';

// Interest provider
const InterestsProvider: FC = ({ children }): ReactElement => {
  const [interests, setInterests] = useState<IInterest[]>(
    initialValues.interests,
  );

  const getInterestById = (id: string): IInterest | undefined =>
    interests.find(({ _id }) => _id === id);

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
        getInterestById,
      }}
    >
      {children}
    </InterestsContext.Provider>
  );
};

export { InterestsProvider, useInterests };

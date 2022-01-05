import { createContext, useContext } from 'react';

import { defaultAsyncFunc } from '../../utils/helpers';

import { IIssueContext } from './types';

const initialValues = {
  issues: [],
  getIssueFromId: (): undefined => undefined,
  fetchIssues: defaultAsyncFunc,
};

const IssuesContext = createContext<IIssueContext>(initialValues);

const useIssues = (): Readonly<IIssueContext> => useContext(IssuesContext);

export { IssuesContext, useIssues, initialValues };

import React, {
  ReactElement,
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { IIssue } from 'ssw-common';

import { getIssues, isError } from '../../api';

import { IssuesContext, initialValues, useIssues } from './context';

const IssuesProvider: FC = ({ children }): ReactElement => {
  const [issues, setIssues] = useState<IIssue[]>(initialValues.issues);

  const getIssueFromId = (issueId: string): IIssue | undefined =>
    issues.find(({ _id }) => _id === issueId);

  const fetchIssues = useCallback(async () => {
    const res = await getIssues();

    if (!isError(res)) {
      setIssues(res.data.result);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <IssuesContext.Provider value={{ issues, getIssueFromId, fetchIssues }}>
      {children}
    </IssuesContext.Provider>
  );
};

export { useIssues };
export default IssuesProvider;
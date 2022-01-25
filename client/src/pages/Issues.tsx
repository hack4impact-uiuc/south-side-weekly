import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { PopulatedIssue } from 'ssw-common';

import { isError, apiCall } from '../api';
import { Kanban } from '../components';
import AddIssueModal from '../components/modal/AddIssue';
import { SingleSelect } from '../components/select/SingleSelect';
import Loading from '../components/ui/Loading';
import { useAuth } from '../contexts';
import { titleCase } from '../utils/helpers';

import './Issues.scss';

const Issues = (): ReactElement => {
  const [issues, setIssues] = useState<PopulatedIssue[] | null>(null);
  const [viewIssueIndex, setViewIssueIndex] = useState<number>(0);
  const { isAdmin } = useAuth();

  const fetchIssues = useCallback(async (): Promise<void> => {
    const res = await apiCall<{ data: PopulatedIssue[]; count: number }>({
      method: 'GET',
      url: '/issues',
      populate: 'default',
    });

    if (!isError(res)) {
      const allIssues = res.data.result.data;

      allIssues.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );

      const closestIssueIndex = allIssues.findIndex(
        (issue) => new Date() <= new Date(issue.releaseDate),
      );

      if (closestIssueIndex < 0) {
        setViewIssueIndex(allIssues.length - 1);
      } else {
        setViewIssueIndex(closestIssueIndex);
      }

      setIssues(allIssues);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '15vh' }}>
        <h2>{`You are not authorized to view this page >:(`}</h2>
      </div>
    );
  }

  if (!issues) {
    return <Loading open />;
  }

  if (issues.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '15vh' }}>
        <h3>{`No issues found. Create an issue to get started!`}</h3>
        <AddIssueModal />
      </div>
    );
  }

  return (
    <div className="issue-page-wrapper">
      <div className="page-header-content header">
        <div className="issue-list-selector">
          <Icon
            disabled={viewIssueIndex === 0}
            size="large"
            className={`list-toggle ${viewIssueIndex === 0 && 'disabled'}`}
            onClick={() => setViewIssueIndex(viewIssueIndex - 1)}
            name="angle left"
          />

          <SingleSelect
            className="issue-select"
            options={issues.map((issue) => ({
              label: `${new Date(
                issue.releaseDate,
              ).toLocaleDateString()} - ${titleCase(issue.type)}`,
              value: issue._id,
            }))}
            value={issues[viewIssueIndex] ? issues[viewIssueIndex]._id : ''}
            onChange={(e) =>
              setViewIssueIndex(
                issues.findIndex((issue) => issue._id === e?.value),
              )
            }
            isClearable={false}
          />

          <Icon
            disabled={viewIssueIndex === issues.length - 1}
            className={`list-toggle ${
              viewIssueIndex === issues.length - 1 && 'disabled'
            }`}
            size="large"
            name="angle right"
            onClick={() => setViewIssueIndex(viewIssueIndex + 1)}
          />
        </div>
        <AddIssueModal callback={void 0} onUnmount={fetchIssues} />
      </div>

      <Kanban issueId={issues.length > 0 ? issues[viewIssueIndex]._id : ''} />
    </div>
  );
};

export default Issues;

import React, { ReactElement, useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { PopulatedIssue } from 'ssw-common';

import { isError } from '../../api';
import { apiCall } from '../../api/request';
import { Kanban } from '../../components';
import { SingleSelect } from '../../components/select/SingleSelect';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

import './styles.scss';

const Issues = (): ReactElement => {
  const [issues, setIssues] = useState<PopulatedIssue[]>([]);
  const [viewIssueIndex, setViewIssueIndex] = useState<number>(0);

  useEffect(() => {
    const fetchIssues = async (): Promise<void> => {
      const res = await apiCall<{ data: PopulatedIssue[]; count: number }>({
        method: 'GET',
        url: '/issues',
        populate: 'default',
      });

      if (!isError(res)) {
        const allIssues = res.data.result.data;

        allIssues.sort(
          (a, b) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime(),
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
    };

    fetchIssues();
  }, []);

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
              label: new Date(issue.releaseDate).toLocaleDateString(),
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
        <PrimaryButton icon="add" content="Add Issue" />
      </div>

      <Kanban issueId={issues.length > 0 ? issues[viewIssueIndex]._id : ''} />
    </div>
  );
};

export default Issues;

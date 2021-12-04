import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { IIssue } from 'ssw-common';

import { getIssues, isError } from '../../api';
import { Kanban, Select } from '../../components';
import { titleCase } from '../../utils/helpers';

import './styles.scss';

const Issues = (): ReactElement => {
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [viewIssueIndex, setViewIssueIndex] = useState<number>(0);

  useEffect(() => {
    const fetchIssues = async (): Promise<void> => {
      const res = await getIssues();

      if (!isError(res)) {
        const allIssues = res.data.result;

        allIssues.sort(
          (a, b) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime(),
        );

        const closestIssueIndex = allIssues.findIndex(
          (issue) => new Date() <= new Date(issue.releaseDate),
        );

        setViewIssueIndex(closestIssueIndex);

        setIssues(allIssues);
      }
    };

    fetchIssues();
  }, []);

  const formatIssueDate = (issue: IIssue): string => {
    const date = new Date(issue.releaseDate);
    return `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} - ${titleCase(issue.type)}`;
  };

  return (
    <div className="issue-page-wrapper">
      <div className="header">
        <div className="issue-list-selector">
          <Icon
            disabled={viewIssueIndex === 0}
            size="large"
            className={`list-toggle ${viewIssueIndex === 0 && 'disabled'}`}
            onClick={() => setViewIssueIndex(viewIssueIndex - 1)}
            name="angle left"
          />

          <Select
            className="issue-select"
            options={issues.map((issue) => ({
              label: formatIssueDate(issue),
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
        <Button icon="add" content="Add Issue" className="default-btn" />
      </div>

      <Kanban issueId={issues.length > 0 ? issues[viewIssueIndex]._id : ''} />
    </div>
  );
};

export default Issues;

import React, { FC, ReactElement } from 'react';

import { FieldTag } from '..';

interface PitchStatusProps {
  date: Date;
}

const PitchStatusTag: FC<PitchStatusProps> = ({ date }): ReactElement => {
  if (new Date(date) < new Date()) {
    return <FieldTag content="Published" />;
  }
  return <FieldTag content="In Progress" />;
};
export default PitchStatusTag;

/*

const {getIssueById} = useIssues();

interface PitchStatusProps {
  issueStatuses: [insert type here]
}

const PitchStatusTag: FC<PitchStatusProps> = ({ issueStatuses }): ReactElement => {
  const pitchStatus = '';
  const issues = [];
  issueStatuses.forEach((issue) => {
    issues.push(getIssueById(issueId));
  })
  earliestIssue = issues.reduce(function (pre, cur) {
        return new Date(pre.date) > new Date(cur.date) ? cur : pre;
  });
  const issueStatus = issueStatuses.find((issue) => issue.issueId = earliestIssue._id).issueStatus;
  if issueStatus === READY_TO_PUBLISH && earliestIssue.date >= date.now ? pitchStatus = "PUBLISHED" : pitchStatus = "IN PROGRESS";

*/

import React, { FC, ReactElement, useEffect, useState } from 'react';
import { IPitch } from 'ssw-common';

import { FieldTag } from '..';
import { useIssues } from '../../contexts/issues/context';
import { issueStatusEnum } from '../../utils/enums';

interface PitchStatusProps {
  pitch: Partial<IPitch>;
}

const PitchStatusTag: FC<PitchStatusProps> = ({ pitch }): ReactElement => {
  const [status, setStatus] = useState('No issue');

  const { getIssueFromId } = useIssues();

  useEffect(() => {
    if (pitch.issueStatuses?.length === 0) {
      return;
    }

    const pitchIssues = pitch?.issueStatuses?.map((issue) => ({
      issue: getIssueFromId(issue.issueId)!,
      status: issue.issueStatus,
    }));

    pitchIssues?.sort(
      (a, b) =>
        new Date(a.issue.releaseDate).getUTCSeconds() -
        new Date(b.issue.releaseDate).getUTCSeconds(),
    );

    console.log(pitchIssues);

    const earliest = pitchIssues?.[0];

    if (!earliest) {
      return;
    }

    if (
      new Date(earliest.issue.releaseDate) <= new Date() &&
      earliest.status === issueStatusEnum.READY_TO_PUBLISH
    ) {
      setStatus('Published');
      return;
    }

    console.log(earliest);

    setStatus('In Progress');
  }, [pitch, getIssueFromId]);

  return <FieldTag content={status} />;
};

export default PitchStatusTag;

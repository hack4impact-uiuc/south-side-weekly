import React, { FC, ReactElement, useEffect, useState } from 'react';
import { IPitch } from 'ssw-common';

import { useIssues } from '../../contexts/issues/context';
import { formatDate } from '../../utils/helpers';

interface PitchPublishDateProps {
  pitch: Partial<IPitch>;
}

const PitchPublishDate: FC<PitchPublishDateProps> = ({
  pitch,
}): ReactElement => {
  const [date, setDate] = useState('');

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

    const earliest = pitchIssues?.[0];

    if (!earliest) {
      return;
    }
    setDate(formatDate(new Date(earliest.issue.releaseDate)));
  }, [pitch, getIssueFromId]);

  return <p>{date}</p>;
};

export default PitchPublishDate;

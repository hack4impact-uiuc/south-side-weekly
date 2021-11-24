import React, { FC, ReactElement } from 'react';
import { IIssueAggregate, IPitch } from 'ssw-common';
import { PitchInterests } from '..';

interface IssueInterestsProps {
  issue: IIssueAggregate;
}

const IssueInterests: FC<IssueInterestsProps> = ({ issue }): ReactElement => (
  <>
    {issue.aggregated.pitches.map((pitch, index) => (
      <PitchInterests pitch={pitch as Pick<IPitch, 'topics'>} key={index} />
    ))}
  </>
);

export default IssueInterests;

import React, { FC, ReactElement } from 'react';
import { IPitch } from 'ssw-common';

import { FieldTag } from '../..';
import { useInterests, useTeams } from '../../../contexts';

interface PitchItemsProps {
  pitch: Partial<IPitch>;
  type: 'topics' | 'userTeams';
}

const PitchItems: FC<PitchItemsProps> = ({ pitch, type }): ReactElement => {
  const { getInterestById } = useInterests();
  const { getTeamFromId } = useTeams();
  const userTeams =
    pitch.assignmentContributors && pitch.assignmentContributors.length > 0
      ? pitch.assignmentContributors[0].teams
      : [];

  if (type === 'topics') {
    return (
      <>
        {pitch.topics?.map((interest, index) => (
          <FieldTag
            size="small"
            key={index}
            name={getInterestById(interest)?.name}
            hexcode={getInterestById(interest)?.color}
          />
        ))}
      </>
    );
  }
  return (
    <>
      {userTeams?.map((team, index) => (
        <FieldTag
          size="small"
          key={index}
          name={getTeamFromId(team)?.name}
          hexcode={getTeamFromId(team)?.color}
        />
      ))}
    </>
  );
};

export default PitchItems;

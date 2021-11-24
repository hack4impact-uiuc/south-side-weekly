import React, { FC, ReactElement } from 'react';
import { IPitch } from 'ssw-common';

import { FieldTag } from '../..';
import { useAuth, useInterests, useTeams } from '../../../contexts';
import { getUserTeamsForPitch } from '../../../utils/helpers';

interface PitchItemsProps {
  pitch: Partial<IPitch>;
  type: "topics" | "teams"
}

const PitchItems: FC<PitchItemsProps> = ({ pitch, type }): ReactElement => {
  const { getInterestById } = useInterests();
  const { getTeamFromId } = useTeams();
  const {user} = useAuth();
  const userTeams = getUserTeamsForPitch(pitch, user);
  if (type === "topics") {
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

import React, { FC, ReactElement } from 'react';

import { FieldTag } from '../..';
import { useTeams } from '../../../contexts';

interface TeamListProps {
  teamIds: string[];
}

const TeamList: FC<TeamListProps> = ({ teamIds }): ReactElement => {
  const { getTeamFromId } = useTeams();

  return (
    <>
      {teamIds.map((teamId, index) => (
        <FieldTag
          size="small"
          key={index}
          name={getTeamFromId(teamId)?.name}
          hexcode={getTeamFromId(teamId)?.color}
        />
      ))}
    </>
  );
};

export default TeamList;

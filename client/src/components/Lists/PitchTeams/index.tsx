import React, { FC, ReactElement } from 'react';
import { IPitch, IUser } from 'ssw-common';

import { FieldTag } from '../..';
import { useTeams } from '../../../contexts';

interface PitchTeamsProps {
  pitch: IPitch;
  user?: Pick<IUser, '_id'>;
  assignmentContributors?: boolean;
}

const PitchTeams: FC<PitchTeamsProps> = ({
  pitch,
  user,
  assignmentContributors = false,
}): ReactElement => {
  const { getTeamFromId } = useTeams();

  const getPitchTeams = (): string[] => {
    if (user) {
      let contributor: { teams: string[]; [x: string]: any } | undefined;
      if (assignmentContributors) {
        contributor = pitch.assignmentContributors.find(
          (contributor) => contributor.userId === user._id,
        );
      } else {
        contributor = pitch.pendingContributors.find(
          (contributor) => contributor.userId === user._id,
        );
      }
      return contributor?.teams ?? [];
    }

    return pitch.teams.map((team) => team.teamId);
  };

  return (
    <>
      {getPitchTeams().map((teamId, index) => {
        const fullTeam = getTeamFromId(teamId);

        return (
          <FieldTag
            size="small"
            key={index}
            name={fullTeam?.name}
            hexcode={fullTeam?.color}
          />
        );
      })}
    </>
  );
};

export default PitchTeams;

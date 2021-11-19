import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';

import { FieldTag } from '../..';
import { useTeams } from '../../../contexts';

interface UserTeamsProps {
  user: IUser;
}

const UserTeams: FC<UserTeamsProps> = ({ user }): ReactElement => {
  const { getTeamFromId } = useTeams();

  return (
    <>
      {user.teams.map((team, index) => (
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

export default UserTeams;

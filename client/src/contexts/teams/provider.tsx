import React, { ReactElement, FC, useState, useEffect } from 'react';
import { ITeam } from 'ssw-common';

import { getTeams, isError } from '../../api';

import { TeamsContext, initialValues, useTeams } from './context';

const TeamsProvider: FC = ({ children }): ReactElement => {
  const [teams, setTeams] = useState<{ teams: ITeam[] }>(initialValues);

  const getTeamFromId = (teamId: string): ITeam | undefined =>
    teams.teams.find(({ _id }) => _id === teamId);

  useEffect(() => {
    const loadTeams = async (): Promise<void> => {
      const res = await getTeams();

      if (!isError(res)) {
        setTeams({ teams: res.data.result });
      } else {
        setTeams({ teams: [] });
      }
    };

    loadTeams();
  }, []);

  return (
    <TeamsContext.Provider value={{ ...teams, getTeamFromId }}>
      {children}
    </TeamsContext.Provider>
  );
};

export { useTeams };
export default TeamsProvider;

import React, { ReactElement, FC, useState, useEffect } from 'react';
import { useCallback } from 'react';
import { ITeam } from 'ssw-common';

import { getTeams, isError } from '../../api';

import { TeamsContext, initialValues, useTeams } from './context';

const TeamsProvider: FC = ({ children }): ReactElement => {
  const [teams, setTeams] = useState<ITeam[]>(initialValues.teams);

  const getTeamFromId = (teamId: string): ITeam | undefined =>
    teams.find(({ _id }) => _id === teamId);

  const fetchTeams = useCallback(async () => {
    const res = await getTeams();

    if (!isError(res)) {
      setTeams(res.data.result);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <TeamsContext.Provider value={{ teams, getTeamFromId, fetchTeams }}>
      {children}
    </TeamsContext.Provider>
  );
};

export { useTeams };
export default TeamsProvider;

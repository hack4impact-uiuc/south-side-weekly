import React, {
  ReactElement,
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Team } from 'ssw-common';

import { apiCall, isError } from '../../api';

import { TeamsContext, initialValues, useTeams } from './context';

const TeamsProvider: FC = ({ children }): ReactElement => {
  const [teams, setTeams] = useState<Team[]>(initialValues.teams);

  const getTeamFromId = (teamId: string): Team =>
    teams.find(({ _id }) => _id === teamId) || initialValues.getTeamFromId();

  const fetchTeams = useCallback(async () => {
    const res = await apiCall<Team[]>({
      url: '/teams',
      method: 'GET',
    });

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

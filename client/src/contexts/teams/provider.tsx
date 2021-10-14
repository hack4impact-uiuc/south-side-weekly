import React, {
    ReactElement,
    FC,
    useState,
    useEffect,
    useCallback,
  } from 'react';
  
import { getTeams, isError } from '../../api';
import { rolesEnum } from '../../utils/enums';

import { TeamsContext, initialValues, useTeams } from './context';
import { ITeamsContext } from './types';

const TeamsProvider: FC = ({ children }): ReactElement => {
    const [teams, setTeams] = useState<ITeamsContext>(initialValues);
  
    useEffect(() => {
        const loadTeams = async (): Promise<void> => {
          const res = await getTeams();

          if (!isError(res)) {
            setTeams({teams: res.data.result});

          } else {
            setTeams({teams: []});
          } 
        }

        loadTeams();
        
    }, []);
  
    return (
      <TeamsContext.Provider value={{ ...teams }}>{children}</TeamsContext.Provider>
    );
  };
  
  export { useTeams };
  export default TeamsProvider;
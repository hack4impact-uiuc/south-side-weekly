import { createContext, useContext } from 'react';

import { ITeamsContext } from './types';

const initialValues = {
  teams: [],
};

const TeamsContext = createContext<ITeamsContext>(initialValues);

const useTeams = (): Readonly<ITeamsContext> => useContext(TeamsContext);

export { TeamsContext, useTeams, initialValues };

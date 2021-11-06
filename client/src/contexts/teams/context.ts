import { createContext, useContext } from 'react';

import { defaultFunc } from '../../utils/helpers';

import { ITeamsContext } from './types';

const initialValues = {
  teams: [],
  getTeamFromId: (): undefined => undefined,
  fetchTeams: defaultFunc,
};

const TeamsContext = createContext<ITeamsContext>(initialValues);

const useTeams = (): Readonly<ITeamsContext> => useContext(TeamsContext);

export { TeamsContext, useTeams, initialValues };

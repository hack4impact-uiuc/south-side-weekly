import { createContext, useContext } from 'react';
import { Team } from 'ssw-common';

import { defaultFunc } from '../../utils/helpers';

import { ITeamsContext } from './types';

const initialValues = {
  teams: [],
  getTeamFromId: (): Team => ({ name: '', active: false, _id: '', color: '' }),
  fetchTeams: defaultFunc,
};

const TeamsContext = createContext<ITeamsContext>(initialValues);

const useTeams = (): Readonly<ITeamsContext> => useContext(TeamsContext);

export { TeamsContext, useTeams, initialValues };

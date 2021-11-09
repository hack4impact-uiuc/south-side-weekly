import React, { ReactElement } from 'react';
import { ITeam } from 'ssw-common';

import { createManyTeams, updateManyTeams } from '../../../api';
import { useTeams } from '../../../contexts';

import EditableTagModal from './EditableTag';

const EditTeams = (): ReactElement => {
  const { teams, fetchTeams } = useTeams();

  const submitTeam = (teams: Partial<ITeam>[]): void => {
    createManyTeams(teams);
    fetchTeams();
  };

  const updateTeam = (teams: ITeam[]): void => {
    updateManyTeams(teams);
    fetchTeams();
  };

  return (
    <EditableTagModal
      title="Teams"
      allTags={teams}
      onCreate={submitTeam}
      onUpdate={updateTeam}
    />
  );
};

export default EditTeams;

import React, { ReactElement } from 'react';

import { createManyTeams, updateManyTeams } from '../../../api';
import { useTeams } from '../../../contexts';

import EditableTagModal from './EditableTag';

const EditTeams = (): ReactElement => {
  const { teams, fetchTeams } = useTeams();

  return (
    <EditableTagModal
      title="Teams"
      allTags={teams}
      onCreate={createManyTeams}
      onUpdate={updateManyTeams}
      onFetch={fetchTeams}
    />
  );
};

export default EditTeams;

import React, { ReactElement } from 'react';
import toast from 'react-hot-toast';
import { Interest, Team } from 'ssw-common';

import { apiCall, isError } from '../../../api';
import { useTeams } from '../../../contexts';

import EditableTagModal from './EditableTag';

const EditTeams = (): ReactElement => {
  const { teams, fetchTeams } = useTeams();

  const createManyTags = async (
    tags: Partial<Team | Interest>[],
    tagType: 'interests' | 'teams',
    action: 'POST' | 'PUT',
  ): Promise<void> => {
    const res = await apiCall({
      url: `/${tagType}/many`,
      method: action,
      body: { teams: tags },
    });
    const actionVerb = action === 'POST' ? 'create' : 'update';
    if (!isError(res)) {
      toast.success(`Teams ${actionVerb}d`);
    } else {
      toast.error(`Failed to ${actionVerb} teams`);
    }
  };

  return (
    <EditableTagModal
      title="Teams"
      allTags={teams}
      onCreate={(tags) => createManyTags(tags, 'teams', 'POST')}
      onUpdate={(tags) => createManyTags(tags, 'teams', 'PUT')}
      onFetch={fetchTeams}
    />
  );
};

export default EditTeams;

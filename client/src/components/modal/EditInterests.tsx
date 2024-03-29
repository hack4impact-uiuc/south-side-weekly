import React, { ReactElement } from 'react';
import toast from 'react-hot-toast';
import { Team, Interest } from 'ssw-common';

import { apiCall, isError } from '../../api';
import { useInterests } from '../../contexts';

import EditableTagModal from './EditableTag';

const EditInterests = (): ReactElement => {
  const { interests, fetchInterests } = useInterests();

  const createManyTags = async (
    tags: Partial<Team | Interest>[],
    tagType: 'interests' | 'teams',
    action: 'POST' | 'PUT',
  ): Promise<void> => {
    const res = await apiCall({
      url: `/${tagType}/many`,
      method: action,
      body: { interests: tags },
    });
    const actionVerb = action === 'POST' ? 'create' : 'update';
    if (!isError(res)) {
      toast.success(`Interests ${actionVerb}d`);
    } else {
      toast.error(`Failed to ${actionVerb} interests`);
    }
  };

  return (
    <EditableTagModal
      title="Interests"
      allTags={interests}
      onCreate={(tags) => createManyTags(tags, 'interests', 'POST')}
      onUpdate={(tags) => createManyTags(tags, 'interests', 'PUT')}
      onFetch={fetchInterests}
    />
  );
};

export default EditInterests;

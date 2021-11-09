import React, { ReactElement } from 'react';

import { createManyInterests, updateManyInterests } from '../../../api';
import { useInterests } from '../../../contexts';

import EditableTagModal from './EditableTag';

const EditInterests = (): ReactElement => {
  const { interests, fetchInterests } = useInterests();

  return (
    <EditableTagModal
      title="Interests"
      allTags={interests}
      onCreate={createManyInterests}
      onUpdate={updateManyInterests}
      onFetch={fetchInterests}
    />
  );
};

export default EditInterests;

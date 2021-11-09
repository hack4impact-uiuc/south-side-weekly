import React, { ReactElement } from 'react';
import { IInterest } from 'ssw-common';

import { createManyInterests, updateManyInterests } from '../../../api';
import { useInterests } from '../../../contexts';

import EditableTagModal from './EditableTag';

const EditInterests = (): ReactElement => {
  const { interests, fetchInterests } = useInterests();

  const submitInterest = (interests: Partial<IInterest>[]): void => {
    createManyInterests(interests);
    fetchInterests();
  };

  const updateInterest = (interests: IInterest[]): void => {
    updateManyInterests(interests);
    fetchInterests();
  };

  return (
    <EditableTagModal
      title="Interests"
      allTags={interests}
      onCreate={submitInterest}
      onUpdate={updateInterest}
    />
  );
};

export default EditInterests;

import React, { FC, ReactElement } from 'react';
import { MultiValue, ActionMeta } from 'react-select';

import MultiSelect from '../MultiSelect';
import { useTeams } from '../../../contexts';

interface TeamsSelectProps {
  onChange: (
    newValue: MultiValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>,
  ) => void;
  values: string[];
}

const TeamsSelect: FC<TeamsSelectProps> = ({
  onChange,
  values,
}): ReactElement => {
  const { teams } = useTeams();

  return (
    <MultiSelect
      options={teams.map((team) => ({
        value: team._id,
        label: team.name,
      }))}
      placeholder="Teams"
      onChange={onChange}
      value={values}
    />
  );
};

export default TeamsSelect;

import React, { FC, ReactElement, useMemo } from 'react';
import { MultiValue, ActionMeta } from 'react-select';
import cn from 'classnames';

import { useInterests, useTeams } from '../../contexts';
import { useIssues } from '../../contexts/issues/context';

import { MultiSelect } from './MultiSelect';

interface ContextSelectProps {
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
  className?: string;
  type: 'Interests' | 'Teams' | 'Issues';
}

const ContextSelect: FC<ContextSelectProps> = ({
  onChange,
  values,
  className,
  type,
}): ReactElement => {
  const { interests } = useInterests();
  const { teams } = useTeams();
  const { issues } = useIssues();

  const options = useMemo(() => {
    if (type === 'Interests') {
      return interests.map((interest) => ({
        value: interest._id,
        label: interest.name,
      }));
    } else if (type === 'Teams') {
      return teams.map((team) => ({
        value: team._id,
        label: team.name,
      }));
    }
    return issues.map((issue) => ({
      value: issue._id,
      label: issue.releaseDate,
    }));
  }, [interests, teams, issues, type]);

  return (
    <MultiSelect
      options={options}
      placeholder={type}
      onChange={onChange}
      value={values}
      className={cn(className)}
    />
  );
};

export default ContextSelect;

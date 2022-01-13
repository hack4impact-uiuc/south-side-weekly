import React, { FC } from 'react';
import cn from 'classnames';
import { useQueryParams, StringParam } from 'use-query-params';

import { parseOptionsSelect } from '../../utils/helpers';
import { MultiSelect } from '../select/MultiSelect';
import { ContextSelect } from '../select/ContextSelect';

interface MultiMultiSelectFilterProps {
  filterKey: string;
  options?: string[];
  type?: 'interests' | 'teams' | 'default';
  className?: string;
  placeholder?: string;
}

export const MultiSelectFilter: FC<MultiMultiSelectFilterProps> = ({
  filterKey,
  className,
  type = 'default',
  options = [],
  placeholder = 'Select',
}) => {
  const [query, setQuery] = useQueryParams({
    [filterKey]: StringParam,
  });

  const updateQuery = (v: string | undefined): void => {
    if (v === undefined || v === '') {
      setQuery({ [filterKey]: undefined });
      return;
    }

    setQuery({ [filterKey]: v });
  };

  if (type === 'interests' || type === 'teams') {
    return (
      <ContextSelect
        type={type === 'interests' ? 'Interests' : 'Teams'}
        values={query[filterKey]?.split(',') || []}
        onChange={(values) => updateQuery(values.map((v) => v.value).join(','))}
        className={cn(className)}
      />
    );
  }

  return (
    <MultiSelect
      value={query[filterKey]?.split(',') || []}
      options={parseOptionsSelect(options)}
      onChange={(values) => updateQuery(values.map((v) => v.value).join(','))}
      placeholder={placeholder}
      className={cn(className)}
    />
  );
};

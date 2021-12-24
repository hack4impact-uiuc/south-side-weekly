import React, { FC } from 'react';
import cn from 'classnames';
import { useQueryParams, StringParam } from 'use-query-params';

import { parseOptionsSelect } from '../../utils/helpers';
import { SingleSelect } from '../select/SingleSelect';

interface SelectFilterProps {
  filterKey: string;
  options: string[];
  className?: string;
  placeholder?: string;
}

export const SelectFilter: FC<SelectFilterProps> = ({
  filterKey,
  className,
  options,
  placeholder = 'Select',
}) => {
  const [query, setQuery] = useQueryParams({
    [filterKey]: StringParam,
  });

  const updateQuery = (v: string | undefined): void => {
    setQuery({ [filterKey]: v });
  };

  return (
    <SingleSelect
      value={query[filterKey] || ''}
      options={parseOptionsSelect(options)}
      onChange={(v) => updateQuery(v?.value)}
      placeholder={placeholder}
      className={cn(className)}
    />
  );
};

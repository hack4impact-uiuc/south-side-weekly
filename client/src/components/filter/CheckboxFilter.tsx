import React, { FC } from 'react';
import cn from 'classnames';
import { useQueryParams, StringParam } from 'use-query-params';
import { CheckboxProps, Form } from 'semantic-ui-react';

interface CheckboxFilterProps extends CheckboxProps {
  filterKey: string;
  className?: string;
}

export const CheckboxFilter: FC<CheckboxFilterProps> = ({
  filterKey,
  className,
  value = true,
  ...rest
}) => {
  const [query, setQuery] = useQueryParams({
    [filterKey]: StringParam,
  });

  const updateQuery = (): void => {
    setQuery({
      [filterKey]: query[filterKey] === `${value}` ? undefined : `${value}`,
    });
  };

  return (
    <Form.Checkbox
      {...rest}
      value={`${query[filterKey]}` || ''}
      checked={query[filterKey] === `${value}`}
      onChange={updateQuery}
      className={cn(className)}
    />
  );
};

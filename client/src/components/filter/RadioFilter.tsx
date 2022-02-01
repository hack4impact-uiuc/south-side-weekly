import React, { FC } from 'react';
import cn from 'classnames';
import { useQueryParams, StringParam } from 'use-query-params';
import { RadioProps, Form } from 'semantic-ui-react';

interface RadioFilterProps extends RadioProps {
  filterKey: string;
  className?: string;
}

export const RadioFilter: FC<RadioFilterProps> = ({
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
    <Form.Radio
      {...rest}
      value={`${query[filterKey]}` || ''}
      checked={query[filterKey] === `${value}`}
      onChange={updateQuery}
      className={cn(className)}
      onClick={updateQuery}
    />
  );
};

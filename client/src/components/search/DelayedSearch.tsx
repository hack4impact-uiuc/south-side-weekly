import _ from 'lodash';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { Input, InputProps } from 'semantic-ui-react';
import { useQueryParams, withDefault, StringParam } from 'use-query-params';

export const DelayedSearch: FC<InputProps> = ({ ...rest }): ReactElement => {
  const [searchInput, setSearchInput] = useState('');
  const location = useLocation();

  const [, setQuery] = useQueryParams({
    search: withDefault(StringParam, ''),
  });

  const updateQuery = (value: string): void => {
    if (value === '') {
      setQuery({ search: undefined });
      return;
    }
    toast.success(`Searching for ${value}`);
    setQuery((prevQuery) => ({
      ...prevQuery,
      search: value,
    }));
  };

  const DELAY = 500;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedQuery = useCallback(_.debounce(updateQuery, DELAY), []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('search') === null) {
      setSearchInput('');
    }
  }, [location.search]);

  useEffect(() => {
    delayedQuery(searchInput);

    return delayedQuery.cancel;
  }, [searchInput, delayedQuery]);

  return (
    <Input
      {...rest}
      value={searchInput}
      onChange={(_, { value }) => setSearchInput(value)}
      fluid
      placeholder="Search by name or email..."
      icon="search"
      iconPosition="left"
    />
  );
};

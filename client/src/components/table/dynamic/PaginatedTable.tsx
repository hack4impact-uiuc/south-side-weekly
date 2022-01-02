import React, { ReactElement } from 'react';
import { Pagination, Table } from 'semantic-ui-react';
import { useQueryParams, StringParam } from 'use-query-params';

import { parseOptionsSelect } from '../../../utils/helpers';
import { SingleSelect } from '../../select/SingleSelect';

import DynamicTable from './DynamicTable';
import { DynamicColumn } from './types';

interface PaginateOptions<T> {
  records: T[];
  count: number;
  columns: DynamicColumn<T>[];
  pageOptions: string[];
  getModal?: (
    record: T,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => ReactElement;
  onRecordClick?: (record: T) => void;
}

export const PaginatedTable = <T,>({
  records,
  getModal,
  count,
  columns,
  pageOptions,
  onRecordClick,
}: PaginateOptions<T>): ReactElement => {
  const [query, setQuery] = useQueryParams({
    limit: StringParam,
    offset: StringParam,
  });

  const updateQuery = (
    key: 'offset' | 'limit',
    v: string | undefined,
  ): void => {
    if (v === undefined || v === '') {
      setQuery({ [key]: undefined });
      return;
    }

    setQuery({ [key]: v });
  };

  const parseActivePage = (page: string | number | undefined): number => {
    if (page === undefined) {
      return 0;
    }

    return parseInt(String(page), 10) - 1;
  };

  return (
    <div>
      <div style={{ display: 'flex', marginTop: '20px', alignItems: 'center' }}>
        <span>Records per page: </span>
        <SingleSelect
          value={query.limit || '10'}
          options={parseOptionsSelect(pageOptions)}
          onChange={(v) => updateQuery('limit', v ? v?.value : '10')}
          placeholder="Limit"
        />
        <br />
        <div>
          <p>Total count: {count}</p>
        </div>
      </div>
      <DynamicTable<T>
        onRecordClick={onRecordClick}
        getModal={getModal}
        view={{
          records,
          columns,
        }}
        emptyMessage="There are no users."
        footer={
          <Table.HeaderCell>
            <Pagination
              totalPages={Math.ceil(count / parseInt(query.limit || '10', 10))}
              onPageChange={(e, { activePage }) =>
                updateQuery('offset', String(parseActivePage(activePage)))
              }
            />
          </Table.HeaderCell>
        }
      />
    </div>
  );
};

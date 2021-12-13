import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { PaginationProps } from 'semantic-ui-react';

import { isError } from '../../../api';
import DynamicTable from '../DynamicTable';
import { Sort } from '../DynamicTable/types';

import TableFooter from './TableFooter';
import {
  PaginatedColumn,
  PaginationQueryArgs,
  QueryFunction,
  UseableDynamicTableProps,
} from './types';

import './styles.scss';

interface PaginatedTableProps<RecordType, QueryArgs>
  extends UseableDynamicTableProps<RecordType, PaginatedColumn<RecordType>> {
  columns: PaginatedColumn<RecordType>[];
  params: QueryArgs;
  query: QueryFunction<RecordType, QueryArgs>;
  initialSort?: Sort<PaginatedColumn<RecordType>>;
  singleLineWhenPopulated?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const recordsPerPageOptions = [10, 25, 50, 100];
const inititalRecordsPerPage = recordsPerPageOptions[1];
const recordsPerPageSelectOptions = recordsPerPageOptions.map((option) => ({
  label: option.toString(),
  value: option,
}));

const PaginatedTable = <
  RecordType,
  QueryArgs extends Record<string, string[]> = Record<string, string[]>,
>({
  columns,
  params,
  query,
  initialSort,
  singleLineWhenPopulated = true,
  ...dynamicTableProps
}: PaginatedTableProps<RecordType, QueryArgs>): ReactElement => {
  type Column = PaginatedColumn<RecordType>;
  type ResolvedQueryArgs = QueryArgs & PaginationQueryArgs;

  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(inititalRecordsPerPage);

  const [sort, setSort] = useState<Sort<Column> | undefined>(initialSort);

  const [currTotalPages, setCurrTotalPages] = useState(1);
  const [records, setRecords] = useState<RecordType[]>([]);

  const fetchData = useCallback(
    async (page: number): Promise<void> => {
      const getParams = (): ResolvedQueryArgs => ({
        sortBy: sort ? [sort.column.key as string] : [],
        sortDirection: sort ? [sort.direction] : [],
        limit: [recordsPerPage.toString()],
        ...params,
      });
      const res = await query({ page: [page], ...getParams() });
      if (isError(res)) {
        return;
      }

      const { result, totalPages } = res.data;

      setRecords(result);
      setCurrTotalPages(Math.max(1, totalPages));
    },
    [params, query, recordsPerPage, sort],
  );

  useEffect(() => {
    setCurrentPage(0);
    fetchData(0);
  }, [fetchData]);

  const handleColumnClick = (column: Column): Sort<Column> | undefined => {
    let newSort: Sort<Column> | undefined = {
      column,
      direction: 'ascending',
    };
    if (!newSort?.column.key) {
      return undefined;
    }

    if (sort && sort.column.title === column.title) {
      if (sort.direction === 'ascending') {
        newSort.direction = 'descending';
      } else if (sort.direction === 'descending') {
        newSort = undefined;
      }
    }
    setSort(newSort);

    return newSort;
  };

  const handlePageChange = (_: any, { activePage }: PaginationProps): void => {
    const newPage = (activePage as number) - 1;
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  return (
    <DynamicTable<RecordType, Column>
      view={{
        records,
        columns,
      }}
      onHeaderClick={handleColumnClick}
      singleLine={singleLineWhenPopulated && records.length > 0}
      footer={
        <TableFooter
          totalPages={currTotalPages}
          currentPage={currentPage + 1}
          recordsPerPage={recordsPerPage}
          recordsPerPageSelectOptions={recordsPerPageSelectOptions}
          handleRecordsPerPageChange={setRecordsPerPage}
          handlePageChange={handlePageChange}
        />
      }
      {...dynamicTableProps}
    />
  );
};

export default PaginatedTable;

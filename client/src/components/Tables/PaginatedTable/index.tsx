import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Pagination, PaginationProps, Table } from 'semantic-ui-react';

import { isError } from '../../../api';
import TableFooter from './TableFooter';
import DynamicTable from '../DynamicTable';
import { Sort } from '../DynamicTable/types';

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
  ...dynamicTableProps
}: PaginatedTableProps<RecordType, QueryArgs>): ReactElement => {
  type Column = PaginatedColumn<RecordType>;
  type ResolvedQueryArgs = QueryArgs & PaginationQueryArgs;

  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(inititalRecordsPerPage);

  const [sort, setSort] = useState<Sort<Column> | undefined>(initialSort);

  const [totalPages, setTotalPages] = useState(0);
  const [records, setRecords] = useState<RecordType[]>([]);

  const getParams = useCallback(
    (page: number): ResolvedQueryArgs => ({
      sortBy: sort ? [sort.column.key as string] : [],
      sortDirection: sort ? [sort.direction] : [],
      page: [page.toString()],
      limit: [recordsPerPage.toString()],
      ...params,
    }),
    [recordsPerPage, sort, params],
  );

  const queryRecords = useCallback(
    (page: number) => {
      const fetchRecords = async () => {
        const res = await query(getParams(page));
        if (isError(res)) {
          // TODO: handle request error
          return;
        }

        const { result, totalPages } = res.data;

        setRecords(result);
        setTotalPages(totalPages);
        setCurrentPage(page);
      };

      return fetchRecords();
    },
    [getParams],
  );

  const getNewPage = (recordsPerPage: number) => {
    const pagesWithRecords = records.length / recordsPerPage;
    return totalPages > pagesWithRecords
      ? Math.round(pagesWithRecords)
      : currentPage;
  };

  useEffect(() => {
    queryRecords(getNewPage(recordsPerPage));
  }, [queryRecords, recordsPerPage]);

  const handleColumnClick = (column: Column): Sort<Column> | undefined => {
    const sort: Sort<Column> = {
      column,
      direction: 'ascending',
    };

    if (!sort.column.key) {
      return undefined;
    }

    setSort(sort);

    return sort;
  };

  const handlePageChange = (_: any, { activePage }: PaginationProps): void => {
    queryRecords((activePage as number) - 1);
  };

  return (
    <DynamicTable<RecordType, Column>
      view={{
        records,
        columns,
      }}
      onHeaderClick={handleColumnClick}
      footer={
        <TableFooter
          totalPages={totalPages}
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

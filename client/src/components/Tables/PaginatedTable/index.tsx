import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Pagination, PaginationProps, Table } from 'semantic-ui-react';
import { isError } from '../../../api';
import Select from '../../Dropdowns/Select';
import DynamicTable from '../DynamicTable';
import { Sort } from '../DynamicTable/types';
import {
  PaginatedColumn,
  PaginationQueryArgs,
  QueryFunction,
  UseableDynamicTableProps,
} from './types';

import './styles.scss';

interface PaginatedTableProps<RecordType>
  extends UseableDynamicTableProps<RecordType, PaginatedColumn<RecordType>> {
  columns: PaginatedColumn<RecordType>[];
  query: QueryFunction<RecordType>;
  initialSort?: Sort<PaginatedColumn<RecordType>>;
}

const recordsPerPageOptions = [10, 5 * 5, 50, 100];
const inititalRecordsPerPage = recordsPerPageOptions[1];

const PaginatedTable = <RecordType,>({
  columns,
  query,
  initialSort,
  ...dynamicTableProps
}: PaginatedTableProps<RecordType>): ReactElement => {
  type Column = PaginatedColumn<RecordType>;

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(inititalRecordsPerPage);

  const [sort, setSort] = useState<Sort<Column> | undefined>(initialSort);

  const [records, setRecords] = useState<RecordType[]>([]);

  useEffect(() => {
    const queryRecords = async () => {
      const res = await query(getParams());

      if (isError(res)) {
        // TODO: handle request error
        return;
      }

      setRecords(res.data.result);
    };

    queryRecords();
  }, [recordsPerPage, sort]);

  const getParams = useCallback(
    (): PaginationQueryArgs => ({
      sortBy: sort ? [sort.column.key as string] : [],
      sortDirection: sort ? [sort.direction] : [],
      page: [currentPage.toString()],
      limit: [recordsPerPage.toString()],
    }),
    [currentPage, recordsPerPage, sort],
  );

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

  const handlePageChange = async (
    _: any,
    { activePage }: PaginationProps,
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentPage(activePage as number);
  };

  const recordsPerPageSelectOptions = recordsPerPageOptions.map((option) => ({
    label: option.toString(),
    value: option,
  }));

  return (
    <DynamicTable<RecordType, Column>
      view={{
        records,
        columns,
      }}
      {...dynamicTableProps}
      footer={
        <Table.HeaderCell>
          <Pagination
            totalPages={1}
            activePage={currentPage}
            onPageChange={handlePageChange}
          />
          <span className="records-per-page-wrapper">
            Rows per page{' '}
            <Select
              options={recordsPerPageSelectOptions}
              value={recordsPerPage}
              isClearable={false}
              onChange={(newValue) =>
                setRecordsPerPage(newValue?.value ?? inititalRecordsPerPage)
              }
              className="records-per-page-select"
            ></Select>
          </span>
        </Table.HeaderCell>
      }
      onHeaderClick={handleColumnClick}
    />
  );
};

export default PaginatedTable;

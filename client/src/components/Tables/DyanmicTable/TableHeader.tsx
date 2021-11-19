import React, { ReactElement } from 'react';
import { Table } from 'semantic-ui-react';

import { ColumnType, SortDirection } from './types';

interface TableHeaderProps<RecordType> {
  columns: ColumnType<RecordType>[];
  sortColumn?: ColumnType<RecordType>;
  sortDirection?: SortDirection;
  handleSort: (column: ColumnType<RecordType>) => void;
}

const TableHeader = <RecordType,>({
  columns,
  sortDirection,
  sortColumn,
  handleSort,
}: TableHeaderProps<RecordType>): ReactElement => (
  <Table.Header>
    {columns.map((column, index) => (
      <Table.HeaderCell
        width={column.width}
        onClick={() => handleSort(column)}
        sorted={sortColumn?.title === column.title ? sortDirection : undefined}
        key={index}
      >
        {column.title}
      </Table.HeaderCell>
    ))}
  </Table.Header>
);

export default TableHeader;

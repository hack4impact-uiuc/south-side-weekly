import React, { ReactElement } from 'react';
import { Table } from 'semantic-ui-react';

import { ColumnType, SortDirection } from './types';

interface TableHeaderProps<RecordType> {
  columns: ColumnType<RecordType>[];
  sortColumn?: ColumnType<RecordType>;
  sortDirection?: SortDirection;
  onCellClick: (column: ColumnType<RecordType>) => void;
}

const TableHeader = <RecordType,>({
  columns,
  sortDirection,
  sortColumn,
  onCellClick,
}: TableHeaderProps<RecordType>): ReactElement => (
  <Table.Header>
    {columns.map((column, index) => (
      <Table.HeaderCell
        width={column.width}
        onClick={() => onCellClick(column)}
        sorted={sortColumn?.title === column.title ? sortDirection : undefined}
        key={index}
      >
        {column.title}
      </Table.HeaderCell>
    ))}
  </Table.Header>
);

export default TableHeader;

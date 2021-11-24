import React, { ReactElement } from 'react';
import { Table } from 'semantic-ui-react';

import { ColumnType, Sort } from './types';

interface TableHeaderProps<RecordType> {
  columns: ColumnType<RecordType>[];
  sort?: Sort<RecordType>;
  onCellClick: (column: ColumnType<RecordType>) => void;
}

const TableHeader = <RecordType,>({
  columns,
  sort,
  onCellClick,
}: TableHeaderProps<RecordType>): ReactElement => (
  <Table.Header>
    {columns.map((column, index) => (
      <Table.HeaderCell
        width={column.width}
        onClick={() => onCellClick(column)}
        sorted={
          sort?.column?.title === column.title ? sort?.direction : undefined
        }
        key={index}
      >
        {column.title}
      </Table.HeaderCell>
    ))}
  </Table.Header>
);

export default TableHeader;

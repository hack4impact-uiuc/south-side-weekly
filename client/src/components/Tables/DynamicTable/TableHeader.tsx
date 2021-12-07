import React, { ReactElement } from 'react';
import { Table } from 'semantic-ui-react';

import { DynamicColumn, Sort } from './types';

interface TableHeaderProps<Column> {
  columns: Column[];
  sort?: Sort<Column>;
  onCellClick: (column: Column) => void;
}

const TableHeader = <RecordType, Column extends DynamicColumn<RecordType>>({
  columns,
  sort,
  onCellClick,
}: TableHeaderProps<Column>): ReactElement => {
  console.log(sort);
  return (
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
};

export default TableHeader;

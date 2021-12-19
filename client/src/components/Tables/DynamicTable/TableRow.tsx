import React, { ReactElement } from 'react';
import { Table } from 'semantic-ui-react';

import { DynamicColumn } from './types';

interface TableRowProps<RecordType, Column> {
  record: RecordType;
  columns: Column[];
  onClick: (record: RecordType) => void;
}

const TableRow = <
  RecordType,
  Column extends DynamicColumn<RecordType> = DynamicColumn<RecordType>,
>({
  record,
  columns,
  onClick,
}: TableRowProps<RecordType, Column>): ReactElement => (
  <Table.Row onClick={onClick}>
    {columns.map((column, i) => (
      <Table.Cell key={i} width={column.width}>
        {typeof column.extractor !== 'function'
          ? record[column.extractor]
          : column.extractor(record)}
      </Table.Cell>
    ))}
  </Table.Row>
);

export default TableRow;

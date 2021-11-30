import React, { ReactElement } from 'react';
import { Table } from 'semantic-ui-react';

import { ColumnType } from './types';

interface TableRowProps<RecordType> {
  record: RecordType;
  columns: ColumnType<RecordType>[];
  onClick: (record: RecordType) => void;
}

const TableRow = <RecordType,>({
  record,
  columns,
  onClick,
}: TableRowProps<RecordType>): ReactElement => (
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

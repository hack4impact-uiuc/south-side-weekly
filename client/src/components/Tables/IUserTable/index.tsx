import React, { FC, ReactElement, useEffect, useState } from 'react';
import { ModalProps, SemanticWIDTHS, Table } from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';

import './styles.scss';

interface DirectoryRowProps<RecordType> {
  record: RecordType;
  columns: ColumnType<RecordType>[];
}

interface DirectoryHeaderProps<RecordType> {
  columns: ColumnType<RecordType>[];
  sortColumn: ColumnType<RecordType>;
  handleSort: (column: ColumnType<RecordType>) => void;
}

type SortDirection = 'ascending' | 'descending';

interface ColumnType<RecordType> {
  title: string;
  width?: SemanticWIDTHS;
  // headerModal?: React.FC<ModalProps>;
  order?: SortDirection;
  sorter?: (a: RecordType, b: RecordType) => number;
  extractor: keyof RecordType | ((record: RecordType) => ReactElement);
}

const TableHeader = <IRecord,>({
  columns,
  sortColumn,
  handleSort,
}: DirectoryHeaderProps<IRecord>): ReactElement => (
  <Table.Header>
    {columns.map((column, index) => (
      <Table.HeaderCell
        width={column.width ?? (columns.length as SemanticWIDTHS)}
        onClick={() => handleSort(column)}
        sorted={sortColumn === column ? sortColumn.order : undefined}
        key={index}
      >
        {column.title}
      </Table.HeaderCell>
    ))}
  </Table.Header>
);

const TableRow = <RecordType,>({
  record,
  columns,
}: DirectoryRowProps<RecordType>): ReactElement => (
  <Table.Row>
    {columns.map((column) => {
      if (typeof column.extractor !== 'function') {
        return <Table.Cell>{record[column.extractor]}</Table.Cell>;
      }
      return column.extractor(record);
    })}
  </Table.Row>
);

interface TableProps<RecordType> {
  records: RecordType[];
  columns: ColumnType<RecordType>[];
  initialSortColumn?: ColumnType<RecordType>;
  initialSortDirection?: SortDirection;
}

const ExtendedTable = <RecordType,>({
  records,
  columns,
  initialSortColumn,
  initialSortDirection,
}: TableProps<RecordType>): ReactElement => {
  type Column = ColumnType<RecordType>;

  const [sortedRecords, setSortedRecords] = useState<RecordType[]>(records);
  const [sortColumn, setSortColumn] = useState<Column | undefined>(
    initialSortColumn,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    initialSortDirection,
  );

  useEffect(() => {
    setSortedRecords(records);
  }, [records]);

  const handleSort = (newColumn: Column): void => {
    if (newColumn.sorter === undefined) {
      return;
    }

    if (sortColumn?.title === newColumn.title) {
      if (sortDirection !== 'descending') {
        setSortDirection('descending');
        setSortedRecords(records.slice().reverse());
      } else {
        setSortedRecords(records);
        setSortDirection(undefined);
        setSortColumn(undefined);
      }
    } else {
      setSortColumn(newColumn);
      setSortDirection('ascending');

      const copy = [...records];
      copy.sort(newColumn.sorter);
      setSortedRecords(copy);
    }
  };

  return (
    <Table>
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        handleSort={handleSort}
      />
      {sortedRecords.map((record, i) => (
        <TableRow record={record} columns={columns} key={i} />
      ))}
    </Table>
  );
};

export default ExtendedTable;
export { TableHeader, TableRow };
export type { ColumnType };

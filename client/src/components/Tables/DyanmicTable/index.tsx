import React, { ReactElement, useEffect, useState } from 'react';
import { Icon, ModalProps, SemanticWIDTHS, Table } from 'semantic-ui-react';
import './styles.scss';

interface TableRowProps<RecordType> {
  record: RecordType;
  columns: ColumnType<RecordType>[];
  onClick: (record: RecordType) => void;
}

type SortDirection = 'ascending' | 'descending';

interface TableHeaderProps<RecordType> {
  columns: ColumnType<RecordType>[];
  sortColumn?: ColumnType<RecordType>;
  sortDirection?: SortDirection;
  handleSort: (column: ColumnType<RecordType>) => void;
}

interface ColumnType<RecordType> {
  title: string;
  width?: SemanticWIDTHS;
  headerModal?: React.FC<ModalProps>;
  sorter?: (a: RecordType, b: RecordType) => number;
  extractor: keyof RecordType | ((record: RecordType) => ReactElement);
}

const TableHeader = <IRecord,>({
  columns,
  sortDirection,
  sortColumn,
  handleSort,
}: TableHeaderProps<IRecord>): ReactElement => {
  console.log(columns, sortColumn, sortDirection);
  return (
    <Table.Header>
      {columns.map((column, index) => (
        <Table.HeaderCell
          width={column.width}
          onClick={() => handleSort(column)}
          sorted={sortColumn === column ? sortDirection : undefined}
          key={index}
        >
          {column.title}
          {column.headerModal !== undefined && <Icon name="pencil" />}
        </Table.HeaderCell>
      ))}
    </Table.Header>
  );
};

const TableRow = <RecordType,>({
  record,
  columns,
  onClick,
}: TableRowProps<RecordType>): ReactElement => (
  <Table.Row onClick={onClick}>
    {columns.map((column, i) => (
      <Table.Cell key={i}>
        {typeof column.extractor !== 'function'
          ? record[column.extractor]
          : column.extractor(record)}
      </Table.Cell>
    ))}
  </Table.Row>
);

interface TableProps<RecordType> {
  records: RecordType[];
  columns: ColumnType<RecordType>[];
  initialSortColumn?: ColumnType<RecordType>;
  initialSortDirection?: SortDirection;
  singleLine?: boolean;
  onRecordClick?: (record: RecordType) => void;
}

const DynamicTable = <RecordType,>({
  records,
  columns,
  initialSortColumn,
  initialSortDirection,
  singleLine,
  onRecordClick,
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
    if (sortColumn) {
      const oldSortColumn = sortColumn;
      setSortColumn(undefined);
      handleSort(oldSortColumn);
    }
  }, [records]);

  const handleSort = (newColumn: Column): void => {
    if (newColumn.sorter === undefined) {
      return;
    }

    if (sortColumn?.title === newColumn.title) {
      if (sortDirection === 'ascending') {
        setSortDirection('descending');
        setSortedRecords(sortedRecords.slice().reverse());
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
    <Table
      size="small"
      sortable
      compact
      selectable={onRecordClick !== undefined}
      celled
      fixed
      singleLine={singleLine}
    >
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
      />
      <Table.Body>
        {sortedRecords.map((record, i) => (
          <TableRow
            record={record}
            columns={columns}
            key={i}
            onClick={() => onRecordClick && onRecordClick(record)}
          />
        ))}
      </Table.Body>
    </Table>
  );
};

export default DynamicTable;
export type { ColumnType };

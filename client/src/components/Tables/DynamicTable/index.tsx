import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { Modal, Table } from 'semantic-ui-react';

import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { ColumnType, SortDirection } from './types';

import './styles.scss';

interface TableProps<RecordType> {
  records: RecordType[];
  columns: ColumnType<RecordType>[];
  sortColumn?: ColumnType<RecordType>;
  sortDirection?: SortDirection;
  singleLine?: boolean;
  getModal?: (
    record: RecordType,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => ReactElement;
  emptyMessage?: ReactNode;
  onRecordClick?: (record: RecordType) => void;
}

const DynamicTable = <RecordType,>({
  records,
  columns,
  sortColumn: sortColumnProp,
  sortDirection: sortDirectionProp,
  singleLine,
  getModal,
  emptyMessage,
  onRecordClick,
}: TableProps<RecordType>): ReactElement => {
  type Column = ColumnType<RecordType>;
  type View = { records: RecordType[]; columns: ColumnType<RecordType>[] };

  const [view, setView] = useState<View>({ records, columns });
  const [sortColumn, setSortColumn] = useState<Column | undefined>(
    sortColumnProp,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<RecordType>();
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    sortDirectionProp,
  );

  const openModal = (record: RecordType): void => {
    setCurrentRecord(record);
    setIsOpen(true);
  };

  useEffect(() => {
    const sort = (column: Column, direction?: SortDirection): void => {
      setView(({ records, columns }) => {
        records = [...records];

        if (direction === 'ascending') {
          records = records.sort(column.sorter);
        }
        if (direction === 'descending') {
          records = records.sort(column.sorter).reverse();
        }
        return {
          records,
          columns,
        };
      });
    };

    if (sortColumn) {
      sort(sortColumn, sortDirection);
    }
  }, [sortColumn, sortDirection, records]);

  const handleColumnClick = (column: Column): void => {
    if (!column.sorter) {
      return;
    }

    setSortColumn(column);
    setSortDirection((sortDirection) => {
      if (!sortDirection) {
        return 'ascending';
      }
      if (sortDirection === 'ascending') {
        return 'descending';
      }
      return undefined;
    });
  };

  useEffect(() => {
    setView({
      records,
      columns,
    });
  }, [records, columns]);

  useEffect(() => {
    setSortColumn(sortColumnProp);
  }, [sortColumnProp]);

  useEffect(() => {
    setSortDirection(sortDirectionProp);
  }, [sortDirectionProp]);

  const { records: viewRecords, columns: viewColumns } = view;

  return (
    <Table
      size="small"
      sortable
      compact
      selectable={onRecordClick !== undefined || getModal !== undefined}
      celled
      fixed
      singleLine={singleLine}
      className={`dynamic-table ${
        viewRecords.length === 0 && 'no-results-found'
      }`}
    >
      <TableHeader
        columns={viewColumns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onCellClick={handleColumnClick}
      />
      <Table.Body>
        {viewRecords.length === 0 && emptyMessage}

        {viewRecords.map((record, i) => (
          <TableRow
            record={record}
            columns={viewColumns}
            key={i}
            onClick={() =>
              getModal
                ? openModal(record)
                : onRecordClick && onRecordClick(record)
            }
          />
        ))}

        {getModal &&
          currentRecord &&
          getModal(currentRecord, isOpen, setIsOpen)}
      </Table.Body>
    </Table>
  );
};

export default DynamicTable;
export type { ColumnType };

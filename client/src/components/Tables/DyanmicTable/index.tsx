import React, { ReactElement, useEffect, useState } from 'react';
import { Modal, Table } from 'semantic-ui-react';

import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { ColumnType, SortDirection } from './types';

import './styles.scss';

interface TableProps<RecordType> {
  records: RecordType[];
  columns: ColumnType<RecordType>[];
  initialSortColumn?: ColumnType<RecordType>;
  initialSortDirection?: SortDirection;
  singleLine?: boolean;
  getModalContent?: (record: RecordType) => ReactElement;
  onRecordClick?: (record: RecordType) => void;
}

const DynamicTable = <RecordType,>({
  records,
  columns,
  initialSortColumn,
  initialSortDirection,
  singleLine,
  getModalContent,
  onRecordClick,
}: TableProps<RecordType>): ReactElement => {
  type Column = ColumnType<RecordType>;

  const [sortedRecords, setSortedRecords] = useState<RecordType[]>(records);
  const [sortColumn, setSortColumn] = useState<Column | undefined>(
    initialSortColumn,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<RecordType>();
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    initialSortDirection,
  );
  const openModal = (record: RecordType): void => {
    setCurrentRecord(record);
    setIsOpen(true);
  };
  const handleSort = (newColumn: Column): void => {
    if (!newColumn.sorter) {
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

  useEffect(() => {
    setSortedRecords(records);
    if (sortColumn) {
      const oldSortColumn = sortColumn;
      setSortColumn(undefined);
      handleSort(oldSortColumn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  return (
    <Table
      size="small"
      sortable
      compact
      selectable
      celled
      fixed
      singleLine={singleLine}
      className="dynamic-table"
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
            onClick={() =>
              getModalContent
                ? openModal(record)
                : onRecordClick && onRecordClick(record)
            }
          />
        ))}

        {getModalContent ? (
          <Modal
            size="large"
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="review-user-modal"
          >
            {currentRecord ? getModalContent(currentRecord) : ''}
          </Modal>
        ) : (
          ''
        )}
      </Table.Body>
    </Table>
  );
};

export default DynamicTable;
export type { ColumnType };

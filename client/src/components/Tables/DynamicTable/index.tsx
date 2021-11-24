import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Modal, Table } from 'semantic-ui-react';

import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { ColumnType, SortDirection } from './types';

import './styles.scss';

type View<RecordType> = {
  records: RecordType[];
  columns: ColumnType<RecordType>[];
};

interface TableProps<RecordType> {
  view: View<RecordType>;
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
  view: viewProp,
  sortColumn: sortColumnProp,
  sortDirection: sortDirectionProp,
  singleLine,
  getModal,
  emptyMessage,
  onRecordClick,
}: TableProps<RecordType>): ReactElement => {
  type Column = ColumnType<RecordType>;

  const [view, setView] = useState<View<RecordType>>(viewProp);
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

  const sort = (column?: Column, direction?: SortDirection): void => {
    setView(({ records, columns }) => {
      if (direction === 'ascending' && column) {
        records = records.sort(column.sorter);
      }
      if (direction === 'descending' && column) {
        records = records.sort(column.sorter).reverse();
      }
      return {
        records,
        columns,
      };
    });
  };

  useEffect(() => {
    sort(sortColumn, sortDirection);
  }, [sortColumn, sortDirection]);

  useEffect(() => {
    setView(viewProp);
    sort(sortColumn, sortDirection);
  }, [viewProp]);

  useEffect(() => {
    setSortColumn(sortColumnProp);
  }, [sortColumnProp]);

  useEffect(() => {
    setSortDirection(sortDirectionProp);
  }, [sortDirectionProp]);

  const handleColumnClick = useCallback(
    (column: Column): void => {
      if (!column.sorter) {
        return;
      }

      const newSortColumn = column !== sortColumn;
      const nextSortColumn =
        sortDirection !== 'descending' || newSortColumn ? column : undefined;
      setSortColumn(nextSortColumn);
      setSortDirection((sortDirection) => {
        if (!sortDirection || newSortColumn) {
          return 'ascending';
        }
        if (sortDirection === 'ascending') {
          return 'descending';
        }
        return undefined;
      });
    },
    [sortColumn, sortDirection],
  );

  const { records, columns } = view;

  return (
    <Table
      size="small"
      sortable
      compact
      selectable={onRecordClick !== undefined || getModal !== undefined}
      celled
      fixed
      singleLine={singleLine}
      className={`dynamic-table ${records.length === 0 && 'no-results-found'}`}
    >
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onCellClick={handleColumnClick}
      />
      <Table.Body>
        {records.length === 0 && emptyMessage}

        {records.map((record, i) => (
          <TableRow
            record={record}
            columns={columns}
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
export type { ColumnType, View };

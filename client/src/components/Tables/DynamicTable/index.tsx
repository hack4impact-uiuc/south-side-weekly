import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Table } from 'semantic-ui-react';

import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { ColumnType, Sort, View } from './types';

import './styles.scss';

interface TableProps<RecordType> {
  view: View<RecordType>;
  sort?: Sort<RecordType>;
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
  sort: sortProp,
  singleLine,
  getModal,
  emptyMessage,
  onRecordClick,
}: TableProps<RecordType>): ReactElement => {
  type Column = ColumnType<RecordType>;

  const [view, setView] = useState<View<RecordType>>(viewProp);
  const [sort, setSort] = useState<Sort<RecordType> | undefined>(sortProp);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<RecordType>();

  const openModal = (record: RecordType): void => {
    setCurrentRecord(record);
    setIsOpen(true);
  };

  const sortView = useCallback((): void => {
    if (!sort) {
      setView(({ columns }) => ({
        records: viewProp.records,
        columns,
      }));
      return;
    }

    const { column, direction } = sort;
    setView(({ records, columns }) => {
      records = [...records]; // Copy records so sort isn't done on the records tied to viewProp
      if (direction === 'ascending') {
        return { records: records.sort(column.sorter), columns };
      }
      return { records: records.sort(column.sorter).reverse(), columns };
    });
  }, [sort, viewProp]);

  useEffect(() => {
    sortView();
  }, [sortView, sort]);

  useEffect(() => {
    setView(viewProp);
    sortView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewProp]);

  useEffect(() => {
    setSort(sortProp);
  }, [sortProp]);

  const handleColumnClick = useCallback(
    (column: Column): void => {
      if (!column.sorter) {
        return;
      }

      const newSortColumn = !sort || (sort && column !== sort.column);

      if (newSortColumn) {
        setSort({
          column,
          direction: 'ascending',
        });
        return;
      }

      const nextSortColumn =
        sort?.direction !== 'descending' ? column : undefined;

      if (!nextSortColumn) {
        setSort(undefined);
        return;
      }

      setSort({
        column: nextSortColumn,
        direction: 'descending',
      });
    },
    [sort],
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
        sort={sort}
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

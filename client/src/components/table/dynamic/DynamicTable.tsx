import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Table } from 'semantic-ui-react';

import TableHeader from '../../Tables/DynamicTable/TableHeader';
import TableRow from '../../Tables/DynamicTable/TableRow';

import { DynamicColumn, Sort, View } from './types';

interface DynamicTableProps<T, K extends DynamicColumn<T>> {
  view: View<T, K>;
  singleLine?: boolean;
  getModal?: (
    record: T,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => ReactElement;
  emptyMessage?: ReactNode;
  onRecordClick?: (record: T) => void;
  onHeaderClick?: (column: K) => Sort<K> | undefined;
  footer?: ReactNode;
}

const DynamicTable = <T, K extends DynamicColumn<T> = DynamicColumn<T>>({
  view: viewProp,
  singleLine,
  getModal,
  emptyMessage,
  onRecordClick,
  onHeaderClick,
  footer,
}: DynamicTableProps<T, K>): ReactElement => {
  const [view, setView] = useState<View<T, K>>(viewProp);
  const [sort, setSort] = useState<Sort<K> | undefined>(viewProp.initialSort);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<T>();

  const openModal = (record: T): void => {
    setCurrentRecord(record);
    setIsOpen(true);
  };

  const sortView = useCallback(
    (view: View<T, K>, sort: Sort<K> | undefined): View<T, K> => {
      if (onHeaderClick || !sort) {
        return view;
      }

      const { column, direction } = sort;
      const { records, columns } = view;

      // Copy records so sort isn't done on the records tied to viewProp
      const recordsCopy = [...records].sort(column.sorter);

      if (direction === 'descending') {
        recordsCopy.reverse();
      }

      return {
        records: recordsCopy,
        columns,
      };
    },
    [onHeaderClick],
  );

  useEffect(() => {
    setView((view) => sortView(view, sort));
  }, [sortView, sort]);

  useEffect(() => {
    setView(sortView(viewProp, viewProp.initialSort));
    setSort(viewProp.initialSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewProp]);

  const handleColumnClick = useCallback(
    (column: K) => {
      if (onHeaderClick) {
        const newSort = onHeaderClick(column);
        setSort(newSort);
        return;
      }

      if (!column.sorter) {
        return;
      }
      const newSortColumn = !sort || (sort && column !== sort.column);

      if (newSortColumn) {
        //This causes even columns with no sorting from onHeaderClick to be set as ascending
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
    [sort, onHeaderClick],
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
      <TableHeader<T, K>
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

      <Table.Footer>
        <Table.Row>{footer}</Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default DynamicTable;
export type { DynamicTableProps };

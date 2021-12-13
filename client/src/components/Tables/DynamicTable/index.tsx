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
import { DynamicColumn, Sort, View } from './types';

import './styles.scss';

interface DynamicTableProps<
  RecordType,
  Column extends DynamicColumn<RecordType>,
> {
  view: View<RecordType, Column>;
  singleLine?: boolean;
  getModal?: (
    record: RecordType,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => ReactElement;
  emptyMessage?: ReactNode;
  onRecordClick?: (record: RecordType) => void;
  onHeaderClick?: (column: Column) => Sort<Column> | undefined;
  footer?: ReactNode;
}

const DynamicTable = <
  RecordType,
  Column extends DynamicColumn<RecordType> = DynamicColumn<RecordType>,
>({
  view: viewProp,
  singleLine,
  getModal,
  emptyMessage,
  onRecordClick,
  onHeaderClick,
  footer,
}: DynamicTableProps<RecordType, Column>): ReactElement => {
  const [view, setView] = useState<View<RecordType, Column>>(viewProp);
  const [sort, setSort] = useState<Sort<Column> | undefined>(
    viewProp.initialSort,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<RecordType>();

  const openModal = (record: RecordType): void => {
    setCurrentRecord(record);
    setIsOpen(true);
  };

  const sortView = useCallback((): void => {
    if (onHeaderClick || !sort) {
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
  }, [onHeaderClick, sort, viewProp.records]);

  useEffect(() => {
    sortView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    setView(viewProp);
    setSort(viewProp.initialSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewProp]);

  const handleColumnClick = useCallback(
    (column: Column): void => {
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
      <TableHeader<RecordType, Column>
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

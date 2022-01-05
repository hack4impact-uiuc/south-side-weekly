import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { v4 } from 'uuid';
import cn from 'classnames';
import {
  Modal,
  ModalProps,
  SemanticWIDTHS,
  Table,
  TableProps,
} from 'semantic-ui-react';
import { StringParam, useQueryParams } from 'use-query-params';

import './DynamicTable.scss';

/**
 * Logger for warning user
 *
 * @param message the warning message.
 */
const log = (message: string): void => {
  console.warn(`DynamicTable: ${message}`);
};

/**
 * Generic type for a column in the dynamic table
 */
interface Column<T> {
  id: keyof T;
  value: string | ReactNode | keyof T;
  extractor: ((record: T) => ReactNode) | keyof T;
  onClick?: () => void;
  sorter?: (a: T, b: T) => number;
  sortable?: boolean;
  style?: CSSProperties;
  width?: SemanticWIDTHS;
}

/**
 * Configures a column for the dynamic table
 *
 * @param col the column data to configure.
 * @returns the configured column.
 */
export const configureColumn = <T,>(col: Column<T>): Column<T> => ({
  ...col,
  sortable: col.sortable || col.sorter !== undefined,
});

/**
 * Sorting interface
 */
interface Sort<T> {
  column: Column<T>;
  direction: 'ascending' | 'descending';
}

/**
 * Configuration props for the dynamic table
 */
interface Props<T> extends Omit<TableProps, 'columns'> {
  records: T[];
  columns: Column<T>[];
  style?: CSSProperties;
  headerStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  onRecordClick?: (record: T) => void;
  modal?: ReactElement;
  modalProps?: ModalProps;
  footer?: ReactNode;
  sortType?: 'internal' | 'query';
}

/**
 * A dynamic table component that allows for dynamic column configuration.
 *
 * @param records the records to display in the table.
 * @param columns the columns to display in the table.
 * @param style the style to apply to the table.
 * @param headerStyle the style to apply to the table header.
 * @param bodyStyle the style to apply to the table body.
 * @param onRecordClick a callback to be called when a record is clicked.
 * @param modal modal content to display when a record is clicked.
 * @param modalProps modal props to pass to the modal.
 * @param footer footer content to display at the bottom of the table.
 * @returns a dynamic table.
 */
const DynamicTable = <T,>({
  records,
  columns,
  style,
  headerStyle,
  bodyStyle,
  className,
  modal,
  modalProps,
  onRecordClick,
  footer,
  sortType = 'internal',
  ...rest
}: Props<T>): ReactElement => {
  const [sortedRecords, setSortedRecords] = useState(records);
  const [sort, setSort] = useState<Sort<T>>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setQuery] = useQueryParams({
    sortBy: StringParam,
    orderBy: StringParam,
  });

  useEffect(() => {
    setSortedRecords(records);
  }, [records]);

  useEffect(() => {
    if (sort && sort.column.sortable) {
      if (sortType === 'internal') {
        const sorted = [...records].sort(sort.column.sorter);

        if (sort.direction === 'descending') {
          sorted.reverse();
        } else {
          setSortedRecords(records);
        }

        setSortedRecords(sorted);
      } else {
        setQuery({
          sortBy: String(sort.column.id),
          orderBy: sort.direction,
        });
      }
    } else {
      if (sortType === 'internal') {
        setSortedRecords(records);
      } else {
        setQuery({
          sortBy: undefined,
          orderBy: undefined,
        });
      }
    }
  }, [sort, records, setQuery, sortType]);

  /**
   * Populates a cell of the table using the row and column information
   *
   * @param record the record to populate the cell with
   * @param column the configuration for the cell based on the column configuration
   * @returns the cell content as a ReactNode
   */
  const fillCell = (record: T, column: Column<T>): ReactNode => {
    const { extractor } = column;

    if (typeof extractor === 'function') {
      return extractor(record);
    }

    return record[extractor];
  };

  /**
   * Sorts a column between ascending, descending, and none
   *
   * @param column the column to sort.
   */
  const handleSort = (column: Column<T>): void => {
    const isNewSort = !sort || sort.column.id !== column.id;

    if (isNewSort) {
      setSort({
        column,
        direction: 'ascending',
      });
      return;
    } else if (sort?.direction === 'ascending') {
      setSort({
        column,
        direction: 'descending',
      });
      return;
    }

    setSort(undefined);
  };

  /**
   * The onClick handler for a column header.
   *
   * @param column the column being clicked.
   */
  const handleColumnClick = (column: Column<T>): void => {
    const { onClick, sorter } = column;

    if (!rest.sortable && sorter) {
      log('sorting is disabled');
    } else if (rest.sortable) {
      handleSort(column);
    }

    onClick?.();
  };

  /**
   * The onClick handler for a record in the table
   *
   * @param record the record being clicked
   */
  const handleRecordClick = (record: T): void => {
    if (onRecordClick) {
      onRecordClick(record);
    }

    if (modal) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal open={isModalOpen} size="large" {...modalProps}>
          {modal}
        </Modal>
      )}

      <Table
        compact
        celled
        {...rest}
        style={style}
        className={cn('dynamic-table', className)}
        singleLine
      >
        <Table.Header style={headerStyle}>
          <Table.Row>
            {columns.map((column) => (
              <Table.HeaderCell
                width={column.width}
                onClick={() => handleColumnClick(column)}
                key={v4()}
                sorted={
                  sort?.column.id === column.id && sort.column.sortable
                    ? sort?.direction
                    : undefined
                }
              >
                {column.value}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body style={bodyStyle}>
          {sortedRecords.map((record) => (
            <Table.Row
              className={`${onRecordClick || modal ? 'selectable' : ''}`}
              onClick={() => handleRecordClick(record)}
              key={v4()}
            >
              {columns.map((column) => (
                <Table.Cell width={column.width} key={v4()}>
                  {fillCell(record, column)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
        {footer && (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={columns.length}>
                {footer}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </>
  );
};

export default DynamicTable;

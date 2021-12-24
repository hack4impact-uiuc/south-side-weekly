import React, { FC } from 'react';
import { Pagination, PaginationProps, Table } from 'semantic-ui-react';

import { SingleSelect } from '../../select/SingleSelect';

interface TableFooterProps {
  totalPages: number;
  currentPage: number;
  recordsPerPage: number;
  recordsPerPageSelectOptions: { label: string; value: number }[];
  handleRecordsPerPageChange: (recordsPerPage: number) => void;
  handlePageChange: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps,
  ) => void;
}

const TableFooter: FC<TableFooterProps> = ({
  totalPages,
  currentPage,
  recordsPerPage,
  recordsPerPageSelectOptions,
  handleRecordsPerPageChange,
  handlePageChange,
}) => (
  <Table.HeaderCell>
    <Pagination
      totalPages={totalPages}
      activePage={currentPage}
      onPageChange={handlePageChange}
    />
    <span className="records-per-page-wrapper">
      Rows per page{' '}
      <SingleSelect
        options={recordsPerPageSelectOptions}
        value={recordsPerPage}
        isClearable={false}
        onChange={(newValue) => handleRecordsPerPageChange(newValue!.value!)}
        className="records-per-page-select"
      />
    </span>
  </Table.HeaderCell>
);

export default TableFooter;

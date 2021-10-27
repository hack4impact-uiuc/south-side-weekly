import React, { FC, ReactElement } from 'react';
import { Table } from 'semantic-ui-react';

import './styles.scss';

interface TableProps {
  tableHeader: ReactElement;
  tableBody: ReactElement;
  singleLine: boolean;
}

const TableTool: FC<TableProps> = ({
  singleLine,
  tableHeader,
  tableBody,
}): ReactElement => (
  <div className="directory-table">
    <Table
      size="small"
      sortable
      compact
      celled
      fixed
      singleLine={singleLine}
    >
      <Table.Header>{tableHeader}</Table.Header>
      <Table.Body>{tableBody}</Table.Body>
    </Table>
  </div>
);

export default TableTool;

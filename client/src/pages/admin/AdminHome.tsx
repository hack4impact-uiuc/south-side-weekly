import React, { ReactElement, useEffect, useState } from 'react';
import { Table } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import Sidebar from '../../components/Sidebar';
import { pages } from '../../utils/enums';
import { getUsers, isError } from '../../utils/apiWrapper';

import '../../css/admin/AdminHome.css';

function AdminHome(): ReactElement {
  const [users, setUsers] = useState<[IUser]>([]);

  const getAllUsers = async (): Promise<void> => {
    const res = await getUsers();

    if (!isError(res)) {
      const allUsers = res.data.result;
      setUsers(allUsers);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="admin-home-wrapper">
      <Sidebar currentPage={pages.HOME} />
      <div className="admin-home-content">
        <div>Welcome back, Mustafa!</div>
        <div className="admin-home-table">
          <Table basic>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Teams</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>John</Table.Cell>
                <Table.Cell>Approved</Table.Cell>
                <Table.Cell>None</Table.Cell>
                <Table.Cell>teams</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;

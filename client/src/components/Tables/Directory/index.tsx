import React, { FC, ReactElement } from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { AdminView, FieldTag, UserModal, UserPicture } from '../..';
import { getUserFullName, titleCase } from '../../../utils/helpers';

import './styles.scss';

interface DirectoryTableProps {
  users: IUser[];
}

const TAG_COLORS: { [key: string]: string } = {
  ADMIN: '#FFE9E7',
  STAFF: '#FFECE4',
  CONTRIBUTOR: '#E9F4E7',
  ONBOARDED: '#E9F4E7',
  ONBOARDING_SCHEDULED: '#F6EEFC',
  RECENTLY_ACTIVE: '#E9F4E7',
  ACTIVE: '#E7F2FC',
  INACTIVE: '#FEF5E7',
};

const DirectoryTable: FC<DirectoryTableProps> = ({ users }): ReactElement => {
  interface TagProps {
    label: string;
  }

  const Tag: FC<TagProps> = ({ label }): ReactElement => {
    let color;

    if (TAG_COLORS[label.toUpperCase()] === undefined) {
      color = '#F4F4F4';
    } else {
      color = TAG_COLORS[label.toUpperCase()];
    }

    return (
      <div
        style={{
          padding: 5,
          borderRadius: 1,
          backgroundColor: color,
          width: 'fit-content',
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="directory-table">
      <Table size="small" compact celled fixed singleLine={users.length > 0}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell width={2}>Role</Table.HeaderCell>
            <Table.HeaderCell>Teams</Table.HeaderCell>
            <Table.HeaderCell>Interests</Table.HeaderCell>
            <AdminView>
              <Table.HeaderCell width={2}>Onboarding</Table.HeaderCell>
              <Table.HeaderCell width={1}>Activity</Table.HeaderCell>
              <Table.HeaderCell width={1}>Joined</Table.HeaderCell>
              <Table.HeaderCell width={1}></Table.HeaderCell>
            </AdminView>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.length === 0 && (
            <Table.HeaderCell textAlign="center" width={1}>
              <div style={{ padding: 50 }}>No results found!</div>
            </Table.HeaderCell>
          )}
          {users.map((user, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <UserPicture style={{ width: 25 }} user={user} />
                  <span style={{ marginLeft: '8px' }}>
                    {getUserFullName(user)}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell width={2}>
                <Tag label={titleCase(user.role)} />
              </Table.Cell>
              <Table.Cell>
                {user.currentTeams.map((team, index) => (
                  <FieldTag size="small" key={index} content={team} />
                ))}
              </Table.Cell>
              <Table.Cell>
                {user.interests.map((interest, index) => (
                  <FieldTag size="small" key={index} content={interest} />
                ))}
              </Table.Cell>
              <AdminView>
                <Table.Cell width={2}>
                  <Tag label={titleCase(user.onboardingStatus)} />
                </Table.Cell>
                <Table.Cell width={1}>
                  <Tag label="Active" />
                </Table.Cell>
                <Table.Cell width={1}>
                  {new Date(user.dateJoined).getFullYear()}
                </Table.Cell>

                <Table.Cell width={1}>
                  <UserModal
                    trigger={
                      <Button
                        style={{ background: 'none' }}
                        size="tiny"
                        circular
                        icon
                      >
                        <Icon name="pencil" />
                      </Button>
                    }
                    user={user}
                  />
                </Table.Cell>
              </AdminView>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DirectoryTable;
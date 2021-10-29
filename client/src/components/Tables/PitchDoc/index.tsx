import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { AdminView, FieldTag, UserModal, UserPicture, TableTool } from '../..';
import { getUserFullName } from '../../../utils/helpers';

import './styles.scss';

interface PitchTableProps {
  users: IUser[];
}

interface PitchHeaderProps {
  users: IUser[];
  data: IUser[];
  setData: (data: IUser[]) => void;
}

interface PitchRowProps {
  user: IUser;
}

interface PitchBodyProps {
  data: IUser[];
}

const ROLE_WIDTH = 2;
const ONBOARDING_WIDTH = 2;
const ACTIVITY_WIDTH = 1;
const JOINED_WIDTH = 1;
const EDITED_WIDTH = 1;

const fullNameSort = (a: IUser, b: IUser): number => {
  const aFullName = getUserFullName(a);
  const bFullName = getUserFullName(b);

  return aFullName.localeCompare(bFullName);
};

const roleSort = (a: IUser, b: IUser): number => a.role.localeCompare(b.role);

const onboardingSort = (a: IUser, b: IUser): number =>
  a.onboardingStatus.localeCompare(b.onboardingStatus);

// @todo - implement acitivty
const activitySort = (a: IUser, b: IUser): number => roleSort(a, b);

const joinedSort = (a: IUser, b: IUser): number => {
  const first = new Date(a.dateJoined);
  const second = new Date(b.dateJoined);

  return first.getTime() - second.getTime();
};

interface ColumnEnumValue {
  title: string;
  sort: (a: IUser, b: IUser) => number;
}

const columnsEnum: { [key: string]: ColumnEnumValue } = {
  NAME: {
    title: 'NAME',
    sort: fullNameSort,
  },
  ROLE: {
    title: 'ROLE',
    sort: roleSort,
  },
  ONBOARDING: {
    title: 'ONBOARDING',
    sort: onboardingSort,
  },
  ACTIVITY: {
    title: 'ACTIVITY',
    sort: activitySort,
  },
  JOINED: {
    title: 'JOINED',
    sort: joinedSort,
  },
};

const DirectoryHeader: FC<PitchHeaderProps> = ({
  users,
  data,
  setData,
}): ReactElement => {
  const [column, setColumn] = useState<ColumnEnumValue>();
  const [direction, setDirection] = useState<'ascending' | 'descending'>();

  const handleSort = (newColumn: ColumnEnumValue): void => {
    if (column?.title === newColumn.title) {
      if (direction === 'ascending') {
        setDirection('descending');
        setData(data.slice().reverse());
      } else if (direction === 'descending') {
        setData(users);
        setDirection(undefined);
        setColumn(undefined);
      } else {
        setDirection('ascending');
        setData(data.slice().reverse());
      }
    } else {
      setColumn(newColumn);
      setDirection('ascending');

      const copy = [...data];
      copy.sort(newColumn.sort);
      setData(copy);
    }
  };

  useEffect(() => {
    setData(users);
  }, [users, setData]);

  return (
    <Table.Row>
      <Table.HeaderCell width={1} />
      <Table.HeaderCell
        onClick={() => handleSort(columnsEnum.NAME)}
        sorted={column === columnsEnum.NAME ? direction : undefined}
      >
        Name
      </Table.HeaderCell>
      <Table.HeaderCell
        onClick={() => handleSort(columnsEnum.ROLE)}
        sorted={column === columnsEnum.ROLE ? direction : undefined}
        width={ROLE_WIDTH}
      >
        Role
      </Table.HeaderCell>
      <Table.HeaderCell>Teams</Table.HeaderCell>
      <Table.HeaderCell>Interests</Table.HeaderCell>
      <AdminView>
        <Table.HeaderCell
          onClick={() => handleSort(columnsEnum.ONBOARDING)}
          sorted={column === columnsEnum.ONBOARDING ? direction : undefined}
          width={ONBOARDING_WIDTH}
        >
          Onboarding
        </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => handleSort(columnsEnum.ACTIVITY)}
          sorted={column === columnsEnum.ACTIVITY ? direction : undefined}
          width={ACTIVITY_WIDTH}
        >
          Activity
        </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => handleSort(columnsEnum.JOINED)}
          sorted={column === columnsEnum.JOINED ? direction : undefined}
          width={JOINED_WIDTH}
        >
          Joined
        </Table.HeaderCell>
        <Table.HeaderCell width={EDITED_WIDTH} />
      </AdminView>
    </Table.Row>
  );
};

const DirectoryBody: FC<PitchBodyProps> = ({ data }): ReactElement => (
  <>
    {data.length === 0 && (
      <Table.Row>
        <Table.Cell textAlign="center" width={1}>
          <div className="no-results-found">No results found!</div>
        </Table.Cell>
      </Table.Row>
    )}
    {data.map((user, index) => (
      <DirectoryRow user={user} key={index} />
    ))}
  </>
);

const DirectoryRow: FC<PitchRowProps> = ({ user }): ReactElement => (
  <Table.Row>
    <Table.Cell className="picture-col" width={1}>
      <UserPicture id="user-picture" user={user} />
    </Table.Cell>
    <Table.Cell>{getUserFullName(user)}</Table.Cell>
    <Table.Cell width={ROLE_WIDTH}>
      <FieldTag size="small" content={user.role} />
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
      <Table.Cell width={ONBOARDING_WIDTH}>
        <FieldTag size="small" content={user.onboardingStatus} />
      </Table.Cell>
      <Table.Cell width={ACTIVITY_WIDTH}>
        <FieldTag size="small" content="Active" />
      </Table.Cell>
      <Table.Cell width={JOINED_WIDTH}>
        {new Date(user.dateJoined).getFullYear()}
      </Table.Cell>

      <Table.Cell width={1}>
        <UserModal
          trigger={
            <Button className="open-user-button" size="tiny" circular icon>
              <Icon name="pencil" />
            </Button>
          }
          user={user}
        />
      </Table.Cell>
    </AdminView>
  </Table.Row>
);

const DirectoryTable: FC<PitchTableProps> = ({ users }): ReactElement => {
  const [data, setData] = useState<IUser[]>([]);

  useEffect(() => {
    setData(users);
  }, [users]);

  return (
    <TableTool
      tableHeader={
        <DirectoryHeader users={users} data={data} setData={setData} />
      }
      tableBody={<DirectoryBody data={data} />}
      singleLine={users.length > 0}
    />
  );
};

export default DirectoryTable;

import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { FieldTag, UserPicture, TableTool } from '../..';
import { getUserFullName } from '../../../utils/helpers';
import { useInterests, useTeams } from '../../../contexts';
import TeamModal from '../../Modals/EditTeam';

const ROLE_WIDTH = 2;
const PIC_WIDTH = 1;
const ACTION_WIDTH = 8;
const JOINED_WIDTH = 1;

interface OnboardingHeaderProps {
  users: IUser[];
  data: IUser[];
  setData: (data: IUser[]) => void;
}

interface OnboardingBodyProps {
  data: IUser[];
}

interface OnboardingRowProps {
  user: IUser;
}

interface OnboardingTableProps {
  users: IUser[];
}

interface ColumnEnumValue {
  title: string;
  sort: (a: IUser, b: IUser) => number;
}

const fullNameSort = (a: IUser, b: IUser): number => {
  const aFullName = getUserFullName(a);
  const bFullName = getUserFullName(b);

  return aFullName.localeCompare(bFullName);
};

const dateSort = (a: IUser, b: IUser): number => {
  const first = new Date(a.dateJoined);
  const second = new Date(b.dateJoined);

  return first.getTime() - second.getTime();
};

const columnsEnum: { [key: string]: ColumnEnumValue } = {
  NAME: {
    title: 'NAME',
    sort: fullNameSort,
  },
  REGISTRATION: {
    title: 'REGISTRATION',
    sort: dateSort,
  },
};

const OnboardingHeader: FC<OnboardingHeaderProps> = ({
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
      <Table.HeaderCell width={PIC_WIDTH} />
      <Table.HeaderCell
        onClick={() => handleSort(columnsEnum.NAME)}
        sorted={column === columnsEnum.NAME ? direction : undefined}
      >
        Name
      </Table.HeaderCell>
      <Table.HeaderCell>
        Teams
        <TeamModal
          trigger={
            <Button className="edit-button" size="tiny" circular icon>
              <Icon name="pencil" />
            </Button>
          }
        />
      </Table.HeaderCell>
      <Table.HeaderCell>
        Interests
        {/*TODO: Edit Interest Modal? */}
      </Table.HeaderCell>
      <Table.HeaderCell
        onClick={() => handleSort(columnsEnum.REGISTRATION)}
        sorted={column === columnsEnum.REGISTRATION ? direction : undefined}
      >
        Registration Date
      </Table.HeaderCell>
      <Table.HeaderCell width={ACTION_WIDTH} />
    </Table.Row>
  );
};

const OnboardingRow: FC<OnboardingRowProps> = ({ user }): ReactElement => {
  const { getTeamFromId } = useTeams();
  const { getInterestById } = useInterests();

  return (
    <Table.Row>
      <Table.Cell className="picture-col" width={1}>
        <UserPicture id="user-picture" user={user} />
      </Table.Cell>
      <Table.Cell>{getUserFullName(user)}</Table.Cell>
      <Table.Cell width={ROLE_WIDTH}>
        <FieldTag size="small" content={user.role} />
      </Table.Cell>
      <Table.Cell>
        {user.teams.map((team, index) => (
          <FieldTag
            size="small"
            key={index}
            name={getTeamFromId(team)?.name}
            hexcode={getTeamFromId(team)?.color}
          />
        ))}
      </Table.Cell>
      <Table.Cell>
        {user.interests.map((interest, index) => {
          const fullInterest = getInterestById(interest);

          return (
            <FieldTag
              size="small"
              key={index}
              name={fullInterest?.name}
              hexcode={fullInterest?.color}
            />
          );
        })}
      </Table.Cell>
      <Table.Cell width={JOINED_WIDTH}>
        {new Date(user.dateJoined).getDate()}
      </Table.Cell>
      <Table.Cell width={ACTION_WIDTH}>
        <Button className="decline-button">Decline</Button>
        <Button className="approve-button">Approve</Button>
      </Table.Cell>
    </Table.Row>
  );
};

const OnboardingBody: FC<OnboardingBodyProps> = ({ data }): ReactElement => (
  <>
    {data.length === 0 && (
      <Table.Row>
        <Table.Cell textAlign="center" width={1}>
          <div className="no-results-found">No results found!</div>
        </Table.Cell>
      </Table.Row>
    )}
    {data.map((user, index) => (
      <OnboardingRow user={user} key={index} />
    ))}
  </>
);

const OnboardingTable: FC<OnboardingTableProps> = ({ users }): ReactElement => {
  const [data, setData] = useState<IUser[]>([]);

  useEffect(() => {
    setData(users);
  }, [users]);

  return (
    <TableTool
      tableHeader={
        <OnboardingHeader users={users} data={data} setData={setData} />
      }
      tableBody={<OnboardingBody data={data} />}
      singleLine={users.length > 0}
    />
  );
};

export default OnboardingTable;
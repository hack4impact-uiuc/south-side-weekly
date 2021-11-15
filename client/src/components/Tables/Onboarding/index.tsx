import React, { ReactElement, ReactNode } from 'react';
import { Button } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { FieldTag, UserPicture } from '../..';
import { getUserFullName } from '../../../utils/helpers';
import { useInterests, useTeams } from '../../../contexts';
import EditTeams from '../../Modals/EditableTags/EditTeams';
import DynamicTable, { ColumnType } from '../DyanmicTable';
import { fullNameSort, joinedSort, roleSort } from '../Util/TableUtil';

import './styles.scss';

type OnboardingTableProps = {
  users: IUser[];
};

const OnboardingTable = ({ users }: OnboardingTableProps): ReactElement => {
  const { getTeamFromId } = useTeams();
  const { getInterestById } = useInterests();

  const userColumn: ColumnType<IUser> = {
    title: '',
    width: 1,
    extractor: function getPicture(user: IUser): ReactNode {
      return <UserPicture id="user-picture" user={user} />;
    },
  };
  const nameColumn: ColumnType<IUser> = {
    title: 'Name',
    sorter: fullNameSort,
    extractor: function getUserName(user: IUser): ReactNode {
      return <>{getUserFullName(user)}</>;
    },
  };
  const roleColumn: ColumnType<IUser> = {
    title: 'Role',
    sorter: roleSort,
    extractor: function getRoles(user: IUser): ReactNode {
      return <FieldTag size="small" content={user.role} />;
    },
  };
  const teamsColumn: ColumnType<IUser> = {
    title: (
      <>
        Teams <EditTeams />
      </>
    ),
    extractor: function getTeams(user: IUser): ReactNode {
      return (
        <>
          {user.teams.map((team, index) => (
            <FieldTag
              size="small"
              key={index}
              name={getTeamFromId(team)?.name}
              hexcode={getTeamFromId(team)?.color}
            />
          ))}
        </>
      );
    },
  };
  const interestsColumn: ColumnType<IUser> = {
    title: <>Interests </>,
    extractor: function getInterests(user: IUser): ReactNode {
      return (
        <>
          {user.interests.map((interest, index) => (
            <FieldTag
              size="small"
              key={index}
              name={getInterestById(interest)?.name}
              hexcode={getInterestById(interest)?.color}
            />
          ))}
        </>
      );
    },
  };
  const dateColumn: ColumnType<IUser> = {
    title: 'Registration Date',
    sorter: joinedSort,
    extractor: function getRegistrationDate(user: IUser): ReactNode {
      return <>{new Date(user.dateJoined).toISOString().split('T')[0]}</>;
    },
  };
  const actionsColumn: ColumnType<IUser> = {
    title: '',
    extractor: function getActions(): ReactNode {
      return (
        <div className="actions">
          <Button
            id="decline"
            className="edit-button"
            size="small"
            basic
            compact
          >
            Decline
          </Button>
          <Button
            id="approve"
            className="edit-button"
            size="small"
            color="blue"
            compact
          >
            Approve
          </Button>
        </div>
      );
    },
  };
  const columns = [
    userColumn,
    nameColumn,
    roleColumn,
    teamsColumn,
    interestsColumn,
    dateColumn,
    actionsColumn,
  ];
  return DynamicTable({
    records: users,
    columns: columns,
    singleLine: users.length > 0,
  });
};

export default OnboardingTable;

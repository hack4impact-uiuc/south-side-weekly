import React, { ReactNode } from 'react';
import { IUser } from 'ssw-common';

import {
  EditInterests,
  EditTeams,
  FieldTag,
  InterestList,
  TeamList,
  UserModal,
  UserPicture,
} from '../..';
import { getUserFullName } from '../../../utils/helpers';
import StatusTag from '../../StatusTag';
import { buildPaginatedColumn } from '../PaginatedTable/util';

const nameColumn = buildPaginatedColumn<IUser>({
  title: 'Name',
  key: 'firstName',
  width: 2,
  extractor: getUserFullName,
});

const userColumn = buildPaginatedColumn<IUser>({
  title: '',
  width: 1,
  extractor: function getPicture(user: IUser): ReactNode {
    return <UserPicture id="user-picture" user={user} />;
  },
});

const roleColumn = buildPaginatedColumn<IUser>({
  title: 'Role',
  key: 'role',
  width: 2,
  extractor: function getRoles(user: IUser): ReactNode {
    return <FieldTag size="small" content={user.role} />;
  },
});

const teamsColumnModal = buildPaginatedColumn<IUser>({
  title: (
    <>
      Teams <EditTeams />
    </>
  ),
  extractor: function getTeams(user: IUser): ReactNode {
    return <TeamList teamIds={user.teams} />;
  },
});

const teamsColumnNoModal = buildPaginatedColumn<IUser>({
  title: 'Teams',
  extractor: function getInterests(user: IUser): ReactNode {
    return <TeamList teamIds={user.teams} />;
  },
});

const interestsColumnNoModal = buildPaginatedColumn<IUser>({
  title: 'Interests',
  extractor: function getInterests(user: IUser): ReactNode {
    return <InterestList interestIds={user.interests} />;
  },
});

const interestsColumnModal = buildPaginatedColumn<IUser>({
  title: (
    <>
      Interests <EditInterests />
    </>
  ),
  extractor: function getInterests(user: IUser): ReactNode {
    return <InterestList interestIds={user.interests} />;
  },
});

const onboardDateColumn = buildPaginatedColumn<IUser>({
  title: 'Registration Date',
  key: 'dateJoined',
  width: 2,
  extractor: function getRegistrationDate(user: IUser): ReactNode {
    return new Date(user.dateJoined).toISOString().split('T')[0];
  },
});

const viewDateColumn = buildPaginatedColumn<IUser>({
  title: 'Joined',
  key: 'dateJoined',
  width: 2,
  extractor: function getRegistrationDate(user: IUser): ReactNode {
    return new Date(user.dateJoined).getFullYear();
  },
});

const viewUserColumn = buildPaginatedColumn<IUser>({
  title: '',
  width: 1,
  extractor: function getUserModal(user: IUser): ReactNode {
    return (
      <div className="actions">
        <UserModal user={user} />
      </div>
    );
  },
});

const activityColumn = buildPaginatedColumn<IUser>({
  title: 'Active',
  width: 2,
  extractor: function getActivity(user: IUser): ReactNode {
    return <StatusTag user={user} size="tiny" />;
  },
});

export {
  nameColumn,
  userColumn,
  roleColumn,
  teamsColumnModal,
  teamsColumnNoModal,
  interestsColumnModal,
  interestsColumnNoModal,
  viewUserColumn,
  viewDateColumn,
  onboardDateColumn,
  activityColumn,
};

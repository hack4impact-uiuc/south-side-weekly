import React, { ReactNode } from 'react';
import { IUser } from 'ssw-common';

import {
  EditTeams,
  FieldTag,
  InterestList,
  TeamList,
  UserModal,
  UserPicture,
} from '../..';
import { getUserFullName } from '../../../utils/helpers';
import StatusTag from '../../StatusTag';
import { buildColumn } from '../DynamicTable/util';
import { fullNameSort, joinedSort, roleSort } from '../Util/TableUtil';

const nameColumn = buildColumn<IUser>({
  title: 'Name',
  width: 2,
  sorter: fullNameSort,
  extractor: getUserFullName,
});

const userColumn = buildColumn<IUser>({
  title: '',
  width: 1,
  extractor: function getPicture(user: IUser): ReactNode {
    return <UserPicture id="user-picture" user={user} />;
  },
});

const roleColumn = buildColumn<IUser>({
  title: 'Role',
  width: 2,
  sorter: roleSort,
  extractor: function getRoles(user: IUser): ReactNode {
    return <FieldTag size="small" content={user.role} />;
  },
});

const teamsColumnModal = buildColumn<IUser>({
  title: (
    <>
      Teams <EditTeams />
    </>
  ),
  extractor: function getTeams(user: IUser): ReactNode {
    return <TeamList teamIds={user.teams} />;
  },
});

const teamsColumnNoModal = buildColumn<IUser>({
  title: 'Teams',
  extractor: function getInterests(user: IUser): ReactNode {
    return <TeamList teamIds={user.teams} />;
  },
});

const interestsColumnNoModal = buildColumn<IUser>({
  title: 'Interests',
  extractor: function getInterests(user: IUser): ReactNode {
    return <InterestList interestIds={user.interests} />;
  },
});

const interestsColumnModal = buildColumn<IUser>({
  title: (
    <>
      Interests <EditTeams />
    </>
  ),
  extractor: function getInterests(user: IUser): ReactNode {
    return <InterestList interestIds={user.interests} />;
  },
});

const onboardDateColumn = buildColumn<IUser>({
  title: 'Registration Date',
  width: 2,
  sorter: joinedSort,
  extractor: function getRegistrationDate(user: IUser): ReactNode {
    return new Date(user.dateJoined).toISOString().split('T')[0];
  },
});

const viewDateColumn = buildColumn<IUser>({
  title: 'Joined',
  width: 2,
  sorter: joinedSort,
  extractor: function getRegistrationDate(user: IUser): ReactNode {
    return new Date(user.dateJoined).getFullYear();
  },
});

const viewUserColumn = buildColumn<IUser>({
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

const activityColumn = buildColumn<IUser>({
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

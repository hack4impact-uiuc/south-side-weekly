import React, { ReactNode } from 'react';
import { Button } from 'semantic-ui-react';
import { IUser } from 'ssw-common';
import Swal from 'sweetalert2';

import {
  EditTeams,
  FieldTag,
  UserInterests,
  UserModal,
  UserPicture,
  UserTeams,
} from '../..';
import { getUserFullName } from '../../../utils/helpers';
import { buildColumn } from '../DyanmicTable/util';
import { fullNameSort, joinedSort, roleSort } from '../Util/TableUtil';
import { isError, updateUser } from '../../../api';
import { onboardingStatusEnum } from '../../../utils/enums';


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
    return <UserTeams user={user} />;
  },
});

const teamsColumnNoModal = buildColumn<IUser>({
  title: 'Teams',
  extractor: function getInterests(user: IUser): ReactNode {
    return <UserTeams user={user} />;
  },
});

const interestsColumnNoModal = buildColumn<IUser>({
  title: 'Interests',
  extractor: function getInterests(user: IUser): ReactNode {
    return <UserInterests user={user} />;
  },
});

const interestsColumnModal = buildColumn<IUser>({
  title: (
    <>
      Interests <EditTeams />
    </>
  ),
  extractor: function getInterests(user: IUser): ReactNode {
    return <UserInterests user={user} />;
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

const updateUserStatus = async (user: IUser, status: string): Promise<void> => {
  const res = await updateUser({ onboardingStatus: status }, user._id);
  if (!isError(res)) {
    Swal.fire({
      title: 'Updated User Status!',
      icon: 'success',
    });
  }
};

const onboardActionColumn = buildColumn<IUser>({
  title: '',
  extractor: function getActions(user: IUser): ReactNode {
    return (
      <div className="actions">
        <Button
          id="decline"
          className="edit-button"
          size="small"
          onClick={() => updateUserStatus(user, onboardingStatusEnum.DENIED)}
          basic
          compact
        >
          Decline
        </Button>
        <Button
          id="approve"
          className="edit-button"
          size="small"
          onClick={() => updateUserStatus(user, onboardingStatusEnum.ONBOARDED)}
        >
          Approve
        </Button>
      </div>
    );
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
  width: 1,
  extractor: function getActivity(): ReactNode {
    return <FieldTag size="tiny" content="Active" />;
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
  onboardActionColumn,
  viewUserColumn,
  viewDateColumn,
  onboardDateColumn,
  activityColumn,
};

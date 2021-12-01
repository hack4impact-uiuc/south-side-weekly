import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { IUser } from 'ssw-common';
import toast from 'react-hot-toast';

import DynamicTable from '../../DynamicTable';
import ReviewUserModal from '../../../Modals/ReviewUser';
import { nameColumn, roleColumn, userColumn, teamsColumnModal } from '../utils';
import { isError, updateOnboardingStatus } from '../../../../api';
import { onboardingStatusEnum } from '../../../../utils/enums';
import { buildColumn } from '../../DynamicTable/util';

interface DeniedUserProps {
  users: IUser[];
}

const DeniedUsers: FC<DeniedUserProps> = ({ users }): ReactElement => {
  const [data, setData] = useState<IUser[]>(users);

  const updateUserStatus = async (
    user: IUser,
    status: keyof typeof onboardingStatusEnum,
  ): Promise<void> => {
    const res = await updateOnboardingStatus(user._id, status);
    if (!isError(res)) {
      setData(data.filter((d) => d !== user));
      toast.success('Updated User Status!', {
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    setData(users);
  }, [users]);

  const rejectionReasoningColumn = buildColumn<IUser>({
    title: 'Rejection Reasoning',
    extractor: function RejectionReasoningText(user: IUser): ReactNode {
      return user.onboardReasoning;
    },
  });

  const formatDate = (date: Date): string => {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`;
  };

  const appliedDateColumn = buildColumn<IUser>({
    title: 'Applied Date',
    width: 2,
    sorter: (a: IUser, b: IUser): number =>
      a.dateJoined.getTime() - b.dateJoined.getTime(),
    extractor: function AppliedDate(user: IUser): ReactNode {
      return formatDate(new Date(user.dateJoined));
    },
  });

  const teamsColumn = { ...teamsColumnModal };
  teamsColumn.width = 2;

  const columns = [
    userColumn,
    nameColumn,
    roleColumn,
    teamsColumn,
    rejectionReasoningColumn,
    appliedDateColumn,
  ];

  return (
    <div className="table">
      <div className="directory">
        <DynamicTable<IUser>
          view={{ records: data, columns: columns }}
          singleLine={users.length > 0}
          getModal={(user, isOpen, setIsOpen) => (
            <ReviewUserModal
              user={user}
              open={isOpen}
              setOpen={setIsOpen}
              actionUpdate={updateUserStatus}
              type="reject"
            />
          )}
        />
      </div>
    </div>
  );
};

export default DeniedUsers;

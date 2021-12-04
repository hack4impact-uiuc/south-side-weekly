import React, { FC, ReactElement, ReactNode } from 'react';
import { IUser } from 'ssw-common';

import ReviewUserModal from '../../../Modals/ReviewUser';
import { nameColumn, roleColumn, userColumn, teamsColumnModal } from '../utils';
import { buildColumn } from '../../DynamicTable/util';
import PaginatedTable from '../../PaginatedTable';
import { QueryFunction } from '../../PaginatedTable/types';

interface DeniedUserProps<QueryArgs> {
  query: QueryFunction<IUser, QueryArgs>;
  filterParams: QueryArgs;
}

const DeniedUsers = <QueryArgs extends Record<string, string[]>>({
  query,
  filterParams,
}: DeniedUserProps<QueryArgs>): ReactElement => {
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
        <PaginatedTable<IUser, QueryArgs>
          columns={columns}
          query={query}
          params={filterParams}
          emptyMessage={'There are no denied users.'}
          getModal={(user, isOpen, setIsOpen) => (
            <ReviewUserModal
              user={user}
              open={isOpen}
              setOpen={setIsOpen}
              type="reject"
            />
          )}
        />
      </div>
    </div>
  );
};

export default DeniedUsers;

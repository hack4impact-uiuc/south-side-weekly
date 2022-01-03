import React, { FC, useEffect, useMemo } from 'react';
import {
  BasePopulatedPitch,
  BasePopulatedUser,
  FullPopulatedPitch,
} from 'ssw-common';
import { buildColumn } from '..';
import { useAuth } from '../../contexts';
import { findPendingContributor } from '../../utils/helpers';

import { ClaimPitch } from '../modal/ClaimPitch';
import { ReviewPitch } from '../modal/ReviewPitch';

import {
  titleColumn,
  descriptionColumn,
  submittedColumn,
  selfWriteColumn,
  googleDocColumn,
  associatedInterestsColumn,
  claimableTeamsColumn,
  teamsRequireApprovalColumn,
  unclaimedTeamsColumn,
  deadlineColumn,
  pitchStatusCol,
  dateSubmittedCol,
  associatedTeamsColumn,
  requestedTeamsColumn,
  claimStatusColumn,
  publishDateColumn,
} from './columns';
import { PaginatedTable } from './dynamic/PaginatedTable';
import { DynamicColumn } from './dynamic/types';

const memberCols: DynamicColumn<FullPopulatedPitch>[] = [
  titleColumn,
  {
    ...associatedInterestsColumn,
    width: '2',
  },
  associatedTeamsColumn,
  deadlineColumn,
];

const submittedCols: DynamicColumn<FullPopulatedPitch>[] = [
  titleColumn,
  { ...descriptionColumn, width: '3' },
  {
    ...associatedInterestsColumn,
    width: '2',
  },
  pitchStatusCol,
  dateSubmittedCol,
];

const claimsSubmittedCols: DynamicColumn<FullPopulatedPitch>[] = [
  {
    ...titleColumn,
    width: '4',
  },
  {
    ...associatedInterestsColumn,
    width: '2',
  },
  requestedTeamsColumn,
  claimStatusColumn,
];

const publishedCols: DynamicColumn<FullPopulatedPitch>[] = [
  {
    ...titleColumn,
    width: '3',
  },
  {
    ...associatedInterestsColumn,
    width: '2',
  },
  associatedTeamsColumn,
  publishDateColumn,
];

interface TableProps {
  count: number;
  data: FullPopulatedPitch[];
  type: 'member' | 'submitted' | 'claim-submitted' | 'published';
}

export const HomepageRecords: FC<TableProps> = ({ data, count, type }) => {
  const { user } = useAuth();
  useEffect(() => {
    const col = buildColumn<FullPopulatedPitch>({
      title: 'Date Submitted',
      width: '1',
      sorter: (p1, p2) =>
        new Date(
          findPendingContributor(p1, user!)?.dateSubmitted ?? Date.now(),
        ).getTime() -
        new Date(
          findPendingContributor(p2, user!)?.dateSubmitted ?? Date.now(),
        ).getTime(),
      extractor: function DateCell(pitch) {
        return new Date(
          findPendingContributor(pitch, user!)?.dateSubmitted ?? Date.now(),
        ).toLocaleDateString();
      },
    });

    const colIndex = claimsSubmittedCols.findIndex(
      (col) => col.title === 'Date Submitted',
    );
    if (colIndex < 0) {
      claimsSubmittedCols.push(col);
    } else {
      claimsSubmittedCols[colIndex] = col;
    }
  }, [user]);

  const cols = useMemo(() => {
    switch (type) {
      case 'member':
        return memberCols;
      case 'submitted':
        return submittedCols;
      case 'claim-submitted':
        return claimsSubmittedCols;
      case 'published':
        return publishedCols;
      default:
        return [];
    }
  }, [type]);

  const getModal = useMemo(() => {
    // TODO: Once EditSubmittedPitch modal and EditClaimRequest modal are
    // done remove last two clauses of if and uncomment below
    if (
      type === 'member' ||
      type === 'published' ||
      type === 'submitted' ||
      type === 'claim-submitted'
    ) {
      return undefined;
    }

    // if (type === 'submitted') {
    //   return function getModalOpts(
    //     pitch: FullPopulatedPitch,
    //     open: boolean,
    //     setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    //   ) {
    //     return <ReviewPitch open={open} setOpen={setOpen} id={pitch._id} />;
    //   };
    // }

    // return function getModalOpts(
    //   pitch: FullPopulatedPitch,
    //   open: boolean,
    //   setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    // ) {
    //   return <ClaimPitch open={open} setOpen={setOpen} id={pitch._id} />;
    // };
  }, [type]);

  return (
    <PaginatedTable<FullPopulatedPitch>
      columns={cols}
      records={data}
      count={count}
      pageOptions={['1', '10', '25', '50']}
      getModal={getModal}
      emptyMessage="There are no pitches in this category."
    />
  );
};

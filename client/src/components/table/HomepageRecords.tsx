import React, { FC, useEffect, useMemo } from 'react';
import { BasePopulatedPitch, FullPopulatedPitch, Pitch } from 'ssw-common';

import { useAuth } from '../../contexts';
import { findPendingContributor } from '../../utils/helpers';

import { configureColumn } from './dynamic/DynamicTable2.0';
import {
  titleColumn,
  descriptionColumn,
  associatedInterestsColumn,
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

const memberCols: DynamicColumn<BasePopulatedPitch>[] = [
  titleColumn,
  {
    ...associatedInterestsColumn,
    width: '2',
  },
  associatedTeamsColumn,
  deadlineColumn,
];

const submittedCols: DynamicColumn<BasePopulatedPitch>[] = [
  titleColumn,
  { ...descriptionColumn, width: '3' },
  {
    ...associatedInterestsColumn,
    width: '2',
  },
  pitchStatusCol,
  dateSubmittedCol,
];

const claimsSubmittedCols: DynamicColumn<BasePopulatedPitch>[] = [
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
  data: (BasePopulatedPitch | FullPopulatedPitch)[];
  type: 'member' | 'submitted' | 'claim-submitted' | 'published';
  onModalClose?: () => void;
}

export const HomepageRecords: FC<TableProps> = ({ data, count, type }) => {
  const { user } = useAuth();
  useEffect(() => {
    const col = configureColumn<BasePopulatedPitch>({
      title: 'Date Submitted',
      width: '1',
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

  const viewPitch = (pitch: Pick<Pitch, '_id'>): void => {
    window.open(`/pitch/${pitch._id}`);
  };

  return (
    <PaginatedTable<FullPopulatedPitch | BasePopulatedPitch>
      columns={cols as any}
      records={data}
      count={count}
      pageOptions={['1', '10', '25', '50']}
      onRecordClick={viewPitch}
      emptyMessage="There are no pitches in this category."
      sortType="query"
      sortable
    />
  );
};

import React, { FC, useEffect, useMemo } from 'react';
import { BasePopulatedPitch, FullPopulatedPitch, Pitch } from 'ssw-common';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../contexts';
import { findPendingContributor } from '../../utils/helpers';
import { pitchStatusEnum } from '../../utils/enums';
import { SubmitPitchModal } from '../modal/SubmitPitchModal';

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

export const HomepageRecords: FC<TableProps> = ({
  data,
  count,
  type,
  onModalClose,
}) => {
  const { user } = useAuth();

  const history = useHistory();

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
      getModal={(pitch, open, setOpen) => {
        if (pitch.status === pitchStatusEnum.PENDING) {
          return (
            <SubmitPitchModal
              onUnmount={onModalClose}
              hasTrigger={false}
              pitch={{
                title: pitch.title,
                description: pitch.description,
                topics: pitch.topics.map((topic) => topic._id),
                assignmentGoogleDocLink: pitch.assignmentGoogleDocLink,
                conflictOfInterest: pitch.conflictOfInterest,
                writer: pitch.writer?._id,
                _id: pitch._id,
                isInternal: pitch.isInternal,
              }}
              open={open}
              setOpen={setOpen}
            />
          );
        }

        history.push(`/pitch/${pitch._id}`);
        return <></>;
      }}
      columns={cols as any}
      records={data}
      count={count}
      onRecordClick={viewPitch}
      emptyMessage="There are no pitches in this category."
      sortType="query"
      sortable
      priority="modal"
    />
  );
};

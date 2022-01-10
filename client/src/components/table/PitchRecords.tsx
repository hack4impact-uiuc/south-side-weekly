import React, { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { BasePopulatedPitch } from 'ssw-common';

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
} from './columns';
import { PaginatedTable } from './dynamic/PaginatedTable';

const reviewCols = [
  titleColumn,
  descriptionColumn,
  submittedColumn,
  selfWriteColumn,
  googleDocColumn,
];

const reviewUnclaimedCols = [
  titleColumn,
  teamsRequireApprovalColumn,
  unclaimedTeamsColumn,
  deadlineColumn,
];

const otherCols = [
  titleColumn,
  descriptionColumn,
  associatedInterestsColumn,
  claimableTeamsColumn,
];

interface TableProps {
  count: number;
  data: BasePopulatedPitch[];
  type: 'review-new' | 'review-unclaimed' | 'claim' | 'all';
  onModalClose?: () => void;
}

export const PitchRecords: FC<TableProps> = ({
  data,
  count,
  type,
  onModalClose,
}) => {
  const history = useHistory();
  const cols = useMemo(() => {
    switch (type) {
      case 'review-new':
        return reviewCols;
      case 'review-unclaimed':
        return reviewUnclaimedCols;
      case 'claim':
      case 'all':
        return otherCols;
      default:
        return [];
    }
  }, [type]);

  const getModal = useMemo(() => {
    if (type === 'review-unclaimed' || type === 'all') {
      return undefined;
    }

    if (type === 'review-new') {
      return function getModalOpts(
        pitch: BasePopulatedPitch,
        open: boolean,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>,
      ) {
        return (
          <ReviewPitch
            onUnmount={onModalClose}
            open={open}
            setOpen={setOpen}
            id={pitch._id}
          />
        );
      };
    }

    return function getModalOpts(
      pitch: BasePopulatedPitch,
      open: boolean,
      setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) {
      return (
        <ClaimPitch
          open={open}
          onUnmount={onModalClose}
          setOpen={setOpen}
          id={pitch._id}
        />
      );
    };
  }, [type, onModalClose]);

  const onRecordClick = (pitch: BasePopulatedPitch): void => {
    history.push(`/pitch/${pitch._id}`);
  };

  return (
    <PaginatedTable
      columns={cols}
      records={data}
      count={count}
      pageOptions={['1', '10', '25', '50']}
      getModal={getModal}
      onRecordClick={onRecordClick}
      sortType="query"
      sortable
    />
  );
};

import React, { FC, useMemo } from 'react';
import { Resource } from 'ssw-common';

import { ResourceModal } from '..';
import { useAuth } from '../../contexts';

import {
  resourceTitleColumn,
  adminResourceTitleColumn,
  visibilityColumn,
} from './columns';
import { PaginatedTable } from './dynamic/PaginatedTable';

interface TableProps {
  count: number;
  resources: Resource[];
  onModalClose?: () => void;
}

export const ResourceRecords: FC<TableProps> = ({
  resources,
  count,
  onModalClose,
}) => {
  const { isOnboarded, isAdmin } = useAuth();

  const cols = useMemo(() => {
    if (!isOnboarded || !isAdmin) {
      return [resourceTitleColumn];
    }

    return [adminResourceTitleColumn, visibilityColumn];
  }, [isAdmin, isOnboarded]);

  return (
    <PaginatedTable<Resource>
      count={count}
      pageOptions={['1', '10', '25', '50']}
      sortType="query"
      sortable
      records={resources}
      columns={cols}
      onRecordClick={(resource) => {
        if (!isAdmin || !isOnboarded) {
          window.open(resource.link, '_blank');
        }
      }}
      getModal={(resource, open, setOpen) => (
        <>
          {isAdmin && isOnboarded && (
            <ResourceModal
              resource={resource}
              open={open}
              setOpen={setOpen}
              action="edit"
              onUnmount={onModalClose}
            />
          )}
        </>
      )}
      noHeader={!isAdmin || !isOnboarded}
    />
  );
};

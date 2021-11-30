import React, { FC, ReactElement, ReactNode } from 'react';
import { IResource } from 'ssw-common';
import { FieldTag, ResourceModal } from '../..';

import DynamicTable from '../DyanmicTable';
import { buildColumn } from '../DyanmicTable/util';

interface ResourceTableProps {
  resource: IResource[];
  closeModalAction: () => void;
  openModalAction: () => void;
  isOpen: boolean;
}

const ResourceTable: FC<ResourceTableProps> = ({
  resource,
  closeModalAction,
  openModalAction,
  isOpen,
}): ReactElement => {
  const titleColumn = buildColumn<IResource>({
    title: 'Title',
    width: 5,
    extractor: function getTitle(resource: IResource): ReactNode {
      return resource.name;
    },
  });

  const visibilityColumn = buildColumn<IResource>({
    title: 'Visibility',
    width: 1,
    extractor: function getVisibility(resource: IResource): ReactNode {
      return <FieldTag size="small" content={resource.visibility} />;
    },
  });

  const editResourceColumn = buildColumn<IResource>({
    title: '',
    width: 1,
    extractor: function getResourceModal(resource: IResource): ReactNode {
      return (
        <div className="actions">
          <ResourceModal
            resource={resource}
            action="edit"
            closeModal={() => {
              alert('kpo');
            }}
          />
        </div>
      );
    },
  });

  const columns = [titleColumn, visibilityColumn];

  return (
    <div className="table">
      <div className="directory">
        <DynamicTable
          records={resource}
          columns={columns}
          getModal={(resource, isOpen) => (
            <ResourceModal
              closeModal={closeModalAction}
              onClose={closeModalAction}
              resource={resource}
              action={'edit'}
              open={isOpen}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ResourceTable;

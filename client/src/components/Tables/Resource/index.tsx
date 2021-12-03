import React, { FC, ReactElement, ReactNode } from 'react';
import { Icon } from 'semantic-ui-react';
import { IResource } from 'ssw-common';

import { FieldTag } from '../..';
import DynamicTable from '../DynamicTable';
import { buildColumn } from '../DynamicTable/util';

interface ResourceTableProps {
  resource: IResource[];
  handleOpen: (selected: IResource) => void;
  isAdmin: boolean;
}

const ResourceTable: FC<ResourceTableProps> = ({
  resource,
  handleOpen,
  isAdmin,
}): ReactElement => {
  const titleColumn = buildColumn<IResource>({
    title: 'Title',
    width: 16,
    sorter: (a: IResource, b: IResource) => a.name.localeCompare(b.name),
    extractor: 'name',
  });

  const visibilityColumn = buildColumn<IResource>({
    title: 'Visibility',
    width: 2,
    sorter: (a: IResource, b: IResource) =>
      a.visibility.localeCompare(b.visibility),
    extractor: function getVisibility(resource: IResource): ReactNode {
      return <FieldTag size="small" content={resource.visibility} />;
    },
  });

  const editResourceColumn = buildColumn<IResource>({
    title: '',
    width: 1,
    extractor: function getResourceModal(resource: IResource): ReactNode {
      return <Icon name="pencil" onClick={() => handleOpen(resource)} />;
    },
  });

  const directToSite = (resource: IResource): void => {
    const newSite = window.open(resource.link, '_target');
    newSite?.focus();
  };

  const adminColumns = [titleColumn, visibilityColumn, editResourceColumn];
  const contributorColumns = [titleColumn];

  return (
    <div className="table">
      <div className="directory">
        <DynamicTable
          view={{
            records: resource,
            columns: isAdmin ? adminColumns : contributorColumns,
          }}
          onRecordClick={isAdmin ? void 0 : directToSite}
        />
      </div>
    </div>
  );
};

export default ResourceTable;

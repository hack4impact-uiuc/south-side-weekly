import React, { FC, ReactElement } from 'react';
import { IPitch } from 'ssw-common';

import DynamicTable from '../DyanmicTable';

import './styles.scss';
import {
  dateColumn,
  teamsColumn,
  titleColumn,
  topicsColumn,
  statusColumn,
} from './utils';

interface ContributionsProps {
  pitches: Partial<IPitch>[];
}

const Contributions: FC<ContributionsProps> = ({ pitches }): ReactElement => {
  const columns = [
    titleColumn,
    topicsColumn,
    teamsColumn,
    dateColumn,
    statusColumn,
  ];

  return (
    <div className="table">
      <div className="directory">
        <DynamicTable
          records={pitches}
          columns={columns}
          singleLine={pitches.length > 0}
        />
      </div>
    </div>
  );
};

export default Contributions;

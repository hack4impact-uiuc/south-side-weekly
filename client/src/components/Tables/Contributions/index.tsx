import React, { FC, ReactElement } from 'react';
import { IPitch, IUser } from 'ssw-common';

import DynamicTable from '../DynamicTable';

import { contributionColumns } from './utils';

import './styles.scss';

interface ContributionsProps {
  pitches: Partial<IPitch>[];
  user: IUser;
}

const Contributions: FC<ContributionsProps> = ({
  pitches,
  user,
}): ReactElement => {
  const columns = contributionColumns(user);
  const view = { records: pitches, columns };
  return (
    <div>
      <DynamicTable<Partial<IPitch>>
        view={view}
        singleLine={pitches.length > 0}
      />
    </div>
  );
};

export default Contributions;

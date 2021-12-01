import React, { FC, ReactElement } from 'react';
import { IPitch, IUser } from 'ssw-common';

import { ColumnType } from '../..';
import DynamicTable from '../DynamicTable';



import './styles.scss';
import { contributionColumns } from './utils';
interface ContributionsProps {
  pitches: Partial<IPitch>[];
  user: IUser;
}

const Contributions: FC<ContributionsProps> = ({ pitches, user }): ReactElement => {
  const columns: ColumnType<Partial<IPitch>>[] = contributionColumns(user);
  const view = {records: pitches, columns};
  return (

      <div>
        <DynamicTable<Partial<IPitch>>
          view = {view}
          singleLine={pitches.length > 0}
        />
      </div>
  

  );
}
  
     
  

export default Contributions;

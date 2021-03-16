import React, { FC, ReactElement } from 'react';
import { IPitch } from 'ssw-common';
import { Grid } from 'semantic-ui-react';

import PitchCard from './PitchCard';

interface IProps {
  pitches: IPitch[];
}

const PitchGrid: FC<IProps> = ({ pitches }): ReactElement => {
  const cards = Array(Math.ceil(pitches.length / 3))
    .fill(0)
    .map((_, index) => {
      const first = pitches[index * 3];
      const second =
        index * 3 + 1 < pitches.length ? pitches[index * 3 + 1] : null;
      const third =
        index * 3 + 2 < pitches.length ? pitches[index * 3 + 2] : null;

      return (
        <Grid.Row key={first.name}>
          <Grid.Column>
            <PitchCard pitch={first} />
          </Grid.Column>
          <Grid.Column>{second && <PitchCard pitch={second} />}</Grid.Column>
          <Grid.Column>{third && <PitchCard pitch={third} />}</Grid.Column>
        </Grid.Row>
      );
    });

  return <Grid columns={3}>{cards}</Grid>;
};

export default PitchGrid;
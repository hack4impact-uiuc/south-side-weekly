import React, { FC, ReactElement } from 'react';
import { IPitch } from 'ssw-common';

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
        <div key={first.name}>
          <PitchCard pitch={first} />

          {second && <PitchCard pitch={second} />}

          {third && <PitchCard pitch={third} />}
        </div>
      );
    });
  return <div>{cards}</div>;
};

export default PitchGrid;

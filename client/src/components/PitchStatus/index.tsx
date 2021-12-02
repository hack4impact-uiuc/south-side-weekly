import React, { FC, ReactElement } from 'react';

import { FieldTag } from '..';

interface PitchStatusProps {
  date: Date;
}

const PitchStatus: FC<PitchStatusProps> = ({ date }): ReactElement => {
  if (new Date(date) < new Date()) {
    return (
      <>
        <FieldTag name="Published" content="published" />
      </>
    );
  }
  return (
    <>
      <FieldTag name="In Progress" hexcode="inprogress" />
    </>
  );
};
export default PitchStatus;

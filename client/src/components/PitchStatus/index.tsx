
import React, { FC, ReactElement } from 'react';

import { FieldTag } from '..';

interface PitchStatusProps {
  date: Date
}

const PitchStatus: FC<PitchStatusProps> = ({ date }): ReactElement => {

if (new Date(date) < new Date()) {
  return (
    <>
      <FieldTag name = "Published" hexcode = "#E9F4E7"/>
    </>
  );
} 
  return (
    <>
      <FieldTag name = "In Progress" hexcode = "#FEF0DB"/>
    </>
  );

}
export default PitchStatus;

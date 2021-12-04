import React, { FC, ReactElement } from 'react';

import { FieldTag } from '..';

interface PitchStatusProps {
  date: Date;
}

const PitchStatusTag: FC<PitchStatusProps> = ({ date }): ReactElement => {
  if (new Date(date) < new Date()) {
    return <FieldTag content="Published" />;
  }
  return <FieldTag content="In Progress" />;
};
export default PitchStatusTag;

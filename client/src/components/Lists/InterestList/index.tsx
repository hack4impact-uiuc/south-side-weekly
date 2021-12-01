import React, { FC, ReactElement } from 'react';

import { FieldTag } from '../..';
import { useInterests } from '../../../contexts';

interface InterestListProps {
  interestIds: string[];
}

const InterestList: FC<InterestListProps> = ({ interestIds }): ReactElement => {
  const { getInterestById } = useInterests();

  return (
    <>
      {interestIds.map((interestId, index) => (
        <FieldTag
          size="small"
          key={index}
          name={getInterestById(interestId)?.name}
          hexcode={getInterestById(interestId)?.color}
        />
      ))}
    </>
  );
};

export default InterestList;

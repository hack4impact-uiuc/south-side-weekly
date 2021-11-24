import React, { FC, ReactElement } from 'react';
import { IPitch } from 'ssw-common';

import { FieldTag } from '../..';
import { useInterests } from '../../../contexts';

interface PitchInterestsProps {
  pitch: Pick<IPitch, 'topics'>;
}

const PitchInterests: FC<PitchInterestsProps> = ({ pitch }): ReactElement => {
  const { getInterestById } = useInterests();

  return (
    <>
      {pitch.topics.map((interest, index) => {
        const fullInterest = getInterestById(interest);

        return (
          <FieldTag
            size="small"
            key={index}
            name={fullInterest?.name}
            hexcode={fullInterest?.color}
          />
        );
      })}
    </>
  );
};

export default PitchInterests;

import React, { FC, ReactElement } from 'react';
import { Card, CardProps } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import { toString } from 'lodash';

import { convertToClassName } from '../../utils/formatters';

import './styles.scss';

interface IProps extends CardProps {
  pitch: IPitch;
}

const MAX_LENGTH = 100;

const PitchCard: FC<IProps> = ({ pitch, ...rest }): ReactElement => {
  const formatDescription = (description: string): string => {
    description = toString(description);

    const newLength = MAX_LENGTH - 3;

    if (description.length > MAX_LENGTH) {
      return `${description.substring(0, newLength)}...`;
    }

    return description;
  };

  return (
    <Card className="pitch-card" {...rest}>
      <Card.Content>
        <div>
          <p>{pitch.name}</p>
          <Card.Description>
            <p>{formatDescription(pitch.pitchDescription)}</p>
          </Card.Description>
          <div className="topics">
            {pitch.topics.map((topic, index) => (
              <div key={index} className={`topic ${convertToClassName(topic)}`}>
                {topic}
              </div>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default PitchCard;

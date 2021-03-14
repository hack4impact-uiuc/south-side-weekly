import React, { FC, ReactElement } from 'react';
import { Card } from 'semantic-ui-react';
import '../../css/pitchDoc/PitchCard.css';
import { IPitch } from 'ssw-common';

import { interestsButtons, enumToInterestButtons } from '../../utils/constants';
import WizardSelectButton from '../WizardSelectButton/WizardSelectButton';

const defaultOnClick= (): void => void 0;

interface IProps {
  pitch: IPitch;
}

const PitchCard: FC<IProps> = ({ pitch }): ReactElement => {
  const topics = pitch.topics.map(
    (topic: string) => enumToInterestButtons[topic],
  );

  return (
    <div>
      <Card>
        <Card.Content>
          <Card.Header>Title of Pitch</Card.Header>
          <Card.Description>
            Here lies a two sentence summary of pitch. It will be two sentences
            and no more.
          </Card.Description>
        </Card.Content>
        <Card.Content>
          {console.log(topics)}
          {interestsButtons.map((button) => (
            <WizardSelectButton
              disabled
              onClick={defaultOnClick}
              key={button.value}
              selectedArray={topics}
              width="150px"
              margin="10px 15px 10px 15px"
              value={button.value}
              color={button.color}
            />
          ))}
        </Card.Content>
      </Card>
    </div>
  );
};

export default PitchCard;

import React, { FC, ReactElement, useState, useEffect } from 'react';
import { Card, Label } from 'semantic-ui-react';
import '../../css/pitchDoc/PitchCard.css';
import { IPitch } from 'ssw-common';

import { getOpenTeams, isError } from '../../utils/apiWrapper';
import {
  currentTeamsButtons,
  teamToTeamsButtons,
  enumToInterestButtons,
  interestsButtons,
} from '../../utils/constants';

const defaultOnClick = (): void => void 0;

interface IProps {
  pitch: IPitch;
  openTeams: {[key: string]: {current: number, target: number}};
}

const PitchCard: FC<IProps> = ({ pitch, openTeams, ...rest }): ReactElement => {
  const [x, setX] = useState<string>("");
  return (
    <div className="pitch-card-wrapper">
      <Card className="pitch-card" {...rest}>
        <Card.Content>
          <Label.Group style={{ marginBottom: 10 }} circular>
            {pitch.topics.map((topic, idx) => (
              <Label
                style={{
                  backgroundColor: interestsButtons[enumToInterestButtons[topic]],
                }}
                key={idx}
              >
                {enumToInterestButtons[topic]}
              </Label>
            ))}
          </Label.Group>
          <Card.Header> {pitch.name} </Card.Header>
          <Card.Description>
            {' '}
            Here lies a two sentence summary of pitch. It will be two sentences
            and no more.{' '}
          </Card.Description>
          <Label.Group style={{ marginTop: 10 }} circular>
            {Object.entries(openTeams).map(([team,], idx) => (
              <Label
                style={{ backgroundColor: currentTeamsButtons[teamToTeamsButtons[team]] }}
                onClick={defaultOnClick}
                key={idx}
              >
                {teamToTeamsButtons[team]}
              </Label>
            ))}
          </Label.Group>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PitchCard;

import React, { FC, ReactElement } from 'react';
import { Card, Label } from 'semantic-ui-react';
import '../../css/pitchDoc/PitchCard.css';
import { IPitch } from 'ssw-common';

import {
  currentTeamsButtons,
  teamToTeamsButtons,
  enumToInterestButtons,
  interestsButtons,
} from '../../utils/constants';

const defaultOnClick = (): void => void 0;

interface IProps {
  pitch: IPitch;
  openTeams: { [key: string]: { current: number; target: number } };
}

const MAX_LABELS = 3;
const MAX_DESCRIPTION_LENGTH = 100;

const PitchCard: FC<IProps> = ({ pitch, openTeams, ...rest }): ReactElement => {
  const formatPitchDescription = (description: string): string => {
    if (!description) {
      return '';
    }

    const shortenedDescriptionLength = 97;

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return `${description.substring(0, shortenedDescriptionLength)}...`;
    }

    return description;
  };

  return (
    <div className="pitch-card-wrapper">
      <Card className="pitch-card" {...rest}>
        <Card.Content>
          <Label.Group style={{ marginBottom: 10 }} circular>
            {pitch.topics.length < 1 && (
              <Label style={{ background: 'lightgrey' }}>{`N/A`}</Label>
            )}
            {pitch.topics.slice(0, 3).map((topic, idx) => (
              <Label
                style={{
                  backgroundColor:
                    interestsButtons[enumToInterestButtons[topic]],
                }}
                key={idx}
              >
                {enumToInterestButtons[topic]}
              </Label>
            ))}
            {pitch.topics.length > MAX_LABELS && (
              <span>{`+${pitch.topics.length - MAX_LABELS}`}</span>
            )}
          </Label.Group>
          <Card.Header> {pitch.name} </Card.Header>
          <Card.Description>
            {formatPitchDescription(pitch.pitchDescription)}
          </Card.Description>
          <Label.Group style={{ marginTop: 10 }} circular>
            {Object.keys(openTeams).length < 1 && (
              <Label style={{ background: 'lightgrey' }}>{`N/A`}</Label>
            )}
            {Object.keys(openTeams)
              .slice(0, 3)
              .map((team: string, idx: number) => (
                <Label
                  style={{
                    background: currentTeamsButtons[teamToTeamsButtons[team]],
                  }}
                  onClick={defaultOnClick}
                  key={idx}
                >
                  {team}
                </Label>
              ))}
            {Object.keys(openTeams).length > MAX_LABELS && (
              <span>{`+${Object.keys(openTeams).length - MAX_LABELS}`}</span>
            )}

            {/* {Object.entries(openTeams).map(([team], idx) => (
              <Label
                style={{
                  backgroundColor: currentTeamsButtons[teamToTeamsButtons[team]],
                }}
                onClick={defaultOnClick}
                key={idx}
              >
                {teamToTeamsButtons[team]}
              </Label>
            ))} */}
          </Label.Group>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PitchCard;

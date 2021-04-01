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
}

const PitchCard: FC<IProps> = ({ pitch, ...rest }): ReactElement => {
  const [openTeams, setOpenTeams] = useState<string[]>([]);

  useEffect(() => {
    const getAllUnclaimedPitches = async (): Promise<void> => {
      const resp = await getOpenTeams(pitch._id);

      if (!isError(resp) && resp.data) {
        const allOpenTeams = [];
        for (const team in resp.data.result) {
          allOpenTeams.push(teamToTeamsButtons[team]);
        }
        setOpenTeams(allOpenTeams);
      }
    };

    getAllUnclaimedPitches();
  }, [pitch._id]);

  return (
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
              {topic}
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
          {openTeams.map((team: string, idx) => (
            <Label
              style={{ backgroundColor: currentTeamsButtons[team] }}
              onClick={defaultOnClick}
              key={idx}
            >
              {team}
            </Label>
          ))}
        </Label.Group>
      </Card.Content>
    </Card>
  );
};

export default PitchCard;

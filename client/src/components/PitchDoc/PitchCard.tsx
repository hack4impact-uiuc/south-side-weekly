import React, { FC, ReactElement } from 'react';
import { Card } from 'semantic-ui-react';
import '../../css/pitchDoc/PitchCard.css';
import { IPitch } from 'ssw-common';

import {
  currentTeamsButtons,
  teamToTeamsButtons,
} from '../../utils/constants';
import WizardSelectButton from '../WizardSelectButton/WizardSelectButton';

const defaultOnClick = (): void => void 0;

interface IProps {
  pitch: IPitch;
}

const PitchCard: FC<IProps> = ({ pitch, ...rest }): ReactElement => {
  // Filter all teams needed
  const teamsNeeded = Object.keys(pitch.teams)
    .filter(function (team) {
      if (pitch.teams[team].current >= pitch.teams[team].target) {
        return false;
      }
      return true;
    })
    .map((team: string) =>
      pitch.teams[team].current < pitch.teams[team].target
        ? teamToTeamsButtons[team]
        : '',
    );

  return (
    <div className="pitch-card-wrapper">
      <Card {...rest}>
        <Card.Content>
          <Card.Header> {pitch.name} </Card.Header>
          <Card.Description>
            {' '}
            Here lies a two sentence summary of pitch. It will be two sentences
            and no more.{' '}
          </Card.Description>
        </Card.Content>
        <Card.Content>
          <div className="container">
            {teamsNeeded.map((team: string) => (
              <WizardSelectButton
                onClick={defaultOnClick}
                key={team}
                selectedArray={[]}
                value={team}
                color={currentTeamsButtons[team]}
              />
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PitchCard;

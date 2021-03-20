import React, { FC, ReactElement } from 'react';
import { Card } from 'semantic-ui-react';
import '../../css/pitchDoc/PitchCard.css';
import { IPitch } from 'ssw-common';

// import {
//   interestsButtons,
//   enumToInterestButtons,
//   currentTeamsButtons,
//   teamToTeamsButtons,
// } from '../../utils/constants';
// import WizardSelectButton from '../WizardSelectButton/WizardSelectButton';

// const defaultOnClick = (): void => void 0;

interface IProps {
  pitch: IPitch;
}

const PitchCard: FC<IProps> = ({ pitch }): ReactElement => {
  // const teamsNeeded = pitch.teams.map(
  //   (team: string) => (pitch.teams[team].current < pitch.teams[team].target) ? teamToTeamsButtons[team] : ""
  // );

  const defaultSummary =
    'Here lies a two sentence summary of pitch. It will be two sentences and no more.';
  return (
    <div>
      <Card>
        <Card.Content>
          <Card.Header> {pitch.name} </Card.Header>
          <Card.Description>{defaultSummary}</Card.Description>
        </Card.Content>
        <Card.Content>
          {/* {teamsNeeded.map((team: string) => (
            <WizardSelectButton
              onClick={defaultOnClick}
              key={team}
              selectedArray={[]}
              width="150px"
              margin="10px 15px 10px 15px"
              value={team}
              color={currentTeamsButtons[team]}
              disabled
            />
          ))} */}
        </Card.Content>
      </Card>
    </div>
  );
};

export default PitchCard;

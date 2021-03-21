import React, { FC, ReactElement, useState, useEffect } from 'react';
import { Card } from 'semantic-ui-react';
import '../../css/pitchDoc/PitchCard.css';
import { IPitch } from 'ssw-common';
import { getOpenTeams, isError } from '../../utils/apiWrapper';

import { currentTeamsButtons, teamToTeamsButtons } from '../../utils/constants';
import WizardSelectButton from '../WizardSelectButton/WizardSelectButton';

const defaultOnClick = (): void => void 0;

interface IProps {
  pitch: IPitch;
}

interface ITeams {
  string: { [key: string]: number }
}

const PitchCard: FC<IProps> = ({ pitch, ...rest }): ReactElement => {
  const [openTeams, setOpenTeams] = useState<ITeams[]>([]);

  useEffect(() => {
    const getAllUnclaimedPitches = async (): Promise<void> => {
      const resp = await getOpenTeams(pitch._id);

      if (!isError(resp) && resp.data) {
        console.log(resp);
        // setOpenTeams(resp.data.result);
        console.log(resp.data.result);
      }
    };

    getAllUnclaimedPitches();
  }, []);

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
            {/* {openTeams.map((team: string) => (
              <WizardSelectButton
                onClick={defaultOnClick}
                key={team}
                selectedArray={[]}
                value={team}
                color={currentTeamsButtons[team]}
              />
            ))} */}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PitchCard;

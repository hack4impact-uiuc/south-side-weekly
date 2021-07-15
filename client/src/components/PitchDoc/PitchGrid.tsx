import React, { FC, ReactElement } from 'react';
import { IPitch } from 'ssw-common';
import { Grid } from 'semantic-ui-react';

import ClaimPitchModal from '../../components/PitchDoc/ClaimPitchModal';
import ApprovePitchModal from '../../components/PitchDoc/ApprovePitchModal';
interface IProps {
  pitches: IPitch[];
  getAllUnclaimedPitches: () => Promise<void>;
}

const PitchGrid: FC<IProps> = ({
  pitches,
  getAllUnclaimedPitches,
}): ReactElement => (
  <Grid>
    <Grid.Row columns={3}>
      {pitches.map((pitch, idx) => (
        <Grid.Column key={idx}>
          {/* <ApprovePitchModal
            pitch={pitch}
            //getAllUnclaimedPitches={getAllUnclaimedPitches}
          /> */}
          {console.log('FDKFLKD', pitch)}
          <ClaimPitchModal
            pitch={pitch}
            getAllUnclaimedPitches={getAllUnclaimedPitches}
          />
        </Grid.Column>
      ))}
    </Grid.Row>
  </Grid>
);

export default PitchGrid;

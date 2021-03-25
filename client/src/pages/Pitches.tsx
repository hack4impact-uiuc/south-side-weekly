import React, { ReactElement, useState } from 'react';
import { Button, Grid, Search } from 'semantic-ui-react';

import SSWTitle from '../assets/ssw-form-header.png';
import Sidebar from '../components/Sidebar';

import '../css/Pitches.css';

enum PitchStatus {
  UNCLAIMED_PITCH,
  PENDING_PITCH,
  PENDING_CLAIM,
}

const Pitches = (): ReactElement => {
  const [pitchStatus, setPitchStatus] = useState<PitchStatus>(
    PitchStatus.UNCLAIMED_PITCH,
  );

  /**
   * Determiens if the status passed in is the active status or not
   * @param status the status that is being checked if active
   * @returns true if the status is active, else false
   */
  const isPitchStatusActive = (status: PitchStatus): boolean =>
    pitchStatus === status;

  return (
    <div>
      <Sidebar />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <img style={{ width: '40%' }} src={SSWTitle} alt="South Side Weekly" />
      </div>
      <div className="pitches-wrapper">
        <h2 style={{ marginLeft: '200px', marginBottom: '50px' }}>
          Pitch Approval
        </h2>
        <Grid centered>
          <Button.Group style={{ marginBottom: '50px' }}>
            <Button
              active={isPitchStatusActive(PitchStatus.UNCLAIMED_PITCH)}
              className={`pitch-status-btn ${
                isPitchStatusActive(PitchStatus.UNCLAIMED_PITCH) && 'active'
              }`}
              onClick={() => setPitchStatus(PitchStatus.UNCLAIMED_PITCH)}
            >
              Unclaimed pitches: 24
            </Button>
            <Button
              active={isPitchStatusActive(PitchStatus.PENDING_PITCH)}
              className={`pitch-status-btn ${
                isPitchStatusActive(PitchStatus.PENDING_PITCH) && 'active'
              }`}
              onClick={() => setPitchStatus(PitchStatus.PENDING_PITCH)}
            >
              Pitches Pending Approval: 14
            </Button>
            <Button
              active={isPitchStatusActive(PitchStatus.PENDING_CLAIM)}
              className={`pitch-status-btn ${
                isPitchStatusActive(PitchStatus.PENDING_CLAIM) && 'active'
              }`}
              onClick={() => setPitchStatus(PitchStatus.PENDING_CLAIM)}
            >
              Claims Pending Approval: 64
            </Button>
          </Button.Group>
        </Grid>
        <Grid centered>
          <Search
            className="search"
            input={{ iconPosition: 'left', fluid: true }}
            fluid
            icon="search"
          />
        </Grid>
      </div>
    </div>
  );
};

export default Pitches;

import React, { ReactElement, useState } from 'react';
import { Button, Dropdown, Grid, Search } from 'semantic-ui-react';

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

  const roleOptions = [
    { key: 1, text: 'Writing', value: 1 },
    { key: 2, text: 'Editing', value: 2 },
    { key: 3, text: 'Visuals', value: 3 },
    { key: 4, text: 'Illustration', value: 4 },
    { key: 5, text: 'Photography', value: 5 },
    { key: 6, text: 'Fact-checking', value: 6 },
  ];

  const topicOptions = [
    { key: 1, text: 'Politics', value: 1 },
    { key: 2, text: 'Education', value: 2 },
    { key: 3, text: 'Housing', value: 3 },
    { key: 4, text: 'Lit', value: 4 },
    { key: 5, text: 'Music', value: 5 },
    { key: 6, text: 'Visual_arts', value: 6 },
    { key: 7, text: 'Stage_and_screen', value: 7 },
    { key: 8, text: 'Food_and_land', value: 8 },
    { key: 9, text: 'Nature', value: 9 },
    { key: 10, text: 'Transportation', value: 10 },
    { key: 11, text: 'Health', value: 11 },
    { key: 12, text: 'Cannabis', value: 12 },
    { key: 13, text: 'Immigration', value: 13 },
    { key: 14, text: 'Fun', value: 14 },
  ];

  const dateOptions = [
    { key: 1, text: 'Earliest to Latest', value: 1 },
    { key: 2, text: 'Latest to Earliest', value: 2 },
  ];

  const claimOptions = [
    { key: 1, text: 'Claimed', value: 1 },
    { key: 2, text: 'Unclaimed', value: 2 },
  ];

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
        <Grid centered style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2>Filter/Sort by: </h2>
            <Dropdown scrolling options={roleOptions} text={'Roles'} />
            <Dropdown scrolling options={topicOptions} text={'Topics'} />
            <Dropdown scrolling options={dateOptions} text={'Date'} />
            <Dropdown scrolling options={claimOptions} text={'Claim Status'} />
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default Pitches;

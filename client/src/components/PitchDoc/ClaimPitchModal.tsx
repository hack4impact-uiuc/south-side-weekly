import React, { FC, ReactElement } from 'react';
import { Modal, Button, Image } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';

import GoogleDriveScreenshot from '../../assets/GoogleDriveScreenshot.png';

import PitchCard from './PitchCard';
import '../../css/pitchDoc/ClaimPitchModal.css';

interface IProps {
  pitch: IPitch;
}

const ClaimPitchModal: FC<IProps> = ({ pitch }): ReactElement => {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<PitchCard pitch={pitch}></PitchCard>}
      closeIcon
    >
      <Modal.Actions>
        <div className="claim-pitches-wrapper">
          <div className="pitch-info">
            <div className="pitch-name"> {pitch.name} </div>
            <div className="submitted-by"> Submitted by: Mustafa Ali </div>
            <div className="summary">
              Here lies a two sentence summary of pitch. It will be two
              sentences and no more.
            </div>
          </div>

          <div className="image">
            <Image src={GoogleDriveScreenshot}></Image>
          </div>

          <div className="container">
            <div className="roles-needed">Roles Needed:</div>

            <div className="modal-submit-button">
              <Button type="submit" onClick={() => setOpen(false)}>
                Claim Pitch!
              </Button>
            </div>
          </div>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default ClaimPitchModal;

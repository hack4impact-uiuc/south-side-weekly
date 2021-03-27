import React, { ReactElement } from 'react';
import { Modal, Button, Form, Image } from 'semantic-ui-react';

import { currentTeamsButtons } from '../../utils/constants';
import '../../css/pitchDoc/SubmitPitchModal.css';
import GoogleDriveScreenshot from '../../assets/GoogleDriveScreenshot.png';
import WizardSelectButton from '../WizardSelectButton/WizardSelectButton';

const defaultOnClick = (): void => void 0;

function SubmitPitchModal(): ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button> Submit a Pitch </Button>}
      closeIcon
    >
      <Modal.Actions>
        <Form>
          <Form.Field>
            Pitch Title
            <label>
              <input />
            </label>
          </Form.Field>
          <Form.Field>
            Summarize Pitch in 1-2 Sentences (300 character limit)
            <label>
              <input />
            </label>
          </Form.Field>

          <div className="suggested-text">Suggested Roles Needed:</div>

          <div className="gdrive-teams-container">
            <Image src={GoogleDriveScreenshot}></Image>

            <div className="teams-section">
              <Form.Group widths="equal">
                {/* {Object.keys(currentTeamsButtons).map((team: string) => (
                  <div key={team}>
                    <WizardSelectButton
                      onClick={defaultOnClick}
                      key={team}
                      selectedArray={[]}
                      width="40px"
                      margin="10px 15px 10px 15px"
                      value={team}
                      color={currentTeamsButtons[team]}
                      disabled
                    />

                    <Form.Field>
                      <input />
                    </Form.Field>
                  </div>
                ))} */}
              </Form.Group>
            </div>

            <div className="break"></div>

            <div className="modal-submit-button">
              <Button type="submit" onClick={() => setOpen(false)}>
                Submit Pitch!
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Actions>
    </Modal>
  );
}

export default SubmitPitchModal;

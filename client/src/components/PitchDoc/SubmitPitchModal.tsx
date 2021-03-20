import React, { ReactElement } from 'react';
import { Modal, Button, Form, Image } from 'semantic-ui-react';

import '../../css/pitchDoc/SubmitPitchModal.css';
import GoogleDriveScreenshot from '../../assets/GoogleDriveScreenshot.png';

function SubmitPitchModal(): ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button> Submit a Pitch </Button>}
    >
      <Modal.Content>
        <Modal.Description></Modal.Description>
      </Modal.Content>

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
          <Image src={GoogleDriveScreenshot}></Image>

          <Form.Group widths="equal">
            Suggested Roles Needed:
            <Form.Field>
              <label>
                <input />
              </label>
            </Form.Field>
            <Form.Field>
              <label>
                <input />
              </label>
            </Form.Field>
            <Form.Field>
              <label>
                <input />
              </label>
            </Form.Field>
          </Form.Group>

          <div className="modal-submit-button">
            <Button type="submit" onClick={() => setOpen(false)}>
              Submit Pitch!
            </Button>
          </div>
        </Form>
      </Modal.Actions>
    </Modal>
  );
}

export default SubmitPitchModal;

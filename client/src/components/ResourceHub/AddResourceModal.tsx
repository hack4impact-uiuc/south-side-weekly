import React, { ReactElement } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import '../../css/AddResourceModal.css';

const teamColors: { [key: string]: string } = {
  Data: '#EF8B8B',
  Editing: '#A5C4F2',
  Factchecking: '#CFE7C4',
  Illustration: '#BAB9E9',
  Layout: '#F9B893',
  Photography: '#D8ACE8',
  Radio: '#F1D8B0',
  Visuals: '#BFEBE0',
  Writing: '#A9D3E5',
};

function AddResourceModal(): ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button className="add-resource-button">Add Resource</Button>}
      closeIcon
    >
      <Modal.Actions>
        <Form className="add-resource-wrapper">
          <div className="add-resource-content">
            <div className="add-resource-inputs">
              <Form.Field>
                Resource Title
                <label className="edit-resource-label">
                  <input />
                </label>
              </Form.Field>
              <Form.Field>
                URL/File Upload
                <label className="edit-resource-label">
                  <input />
                </label>
              </Form.Field>
            </div>

            <div className="role-btns-wrapper">
              Resource Tags:
              <div className="role-btns">
                {Object.keys(teamColors).map((button, idx) => (
                  <Button
                    key={idx}
                    className="role-topic-label"
                    content={button}
                    style={{ backgroundColor: teamColors[button] }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-add-button">
            <Button type="submit" onClick={() => setOpen(false)}>
              Add Resource
            </Button>
          </div>
        </Form>
      </Modal.Actions>
    </Modal>
  );
}

export default AddResourceModal;

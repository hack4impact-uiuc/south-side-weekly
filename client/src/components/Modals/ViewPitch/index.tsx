import React, {
  FC,
  ReactElement,
  useState,
} from 'react';
import { Button, Form, Modal, ModalProps, Label } from 'semantic-ui-react';

import { FieldTag } from '../..';

import './styles.scss';

interface ViewPitchProps extends ModalProps {
  firstEditor: string;
  secondEditor: string;
  thirdEditor: string;
  issueFormat: 'print' | 'other';
  
}

const ViewPitchModal: FC<ViewPitchProps> = ({
  firstEditor,
  secondEditor,
  thirdEditor,
  issueFormat,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <Modal
      trigger={<Button className="default-btn" content="Submit a Pitch" />}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      className="claim-modal"
      {...rest}
    >
      <Modal.Header content='View Pitch' />
      <Modal.Content>
        <h3> Pitch Title </h3>
        <div className="teams-section">
        <FieldTag content='Visual Arts'></FieldTag>
          <div className="team">
          <FieldTag content='Visual Arts'></FieldTag>
          </div>
        </div>
        <p className="description">pitch description pitch description pitch description</p>
  
        <h4>Pitch Creator: </h4>
        <h4>Primary Editor: </h4>
        <Form>
          <Form.Group inline widths={5} className="team-select-group">
            
          </Form.Group>
        </Form>
        <h2>Pitch Claimed By</h2>
        <div className="contributors-section">
        
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          content="Submit my Claim for Review"
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ViewPitchModal;

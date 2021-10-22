import React, { ReactElement, FC, useState } from 'react';
import {
  Button,
  ButtonProps,
  Form,
  Icon,
  Input,
  Modal,
  ModalProps,
} from 'semantic-ui-react';
import Swal from 'sweetalert2';

import './styles.scss';

// interface TeamModalProps extends ModalProps {}

const TeamModalTrigger: FC<ButtonProps> = ({ ...rest }): ReactElement => (
  <Button {...rest} icon>
    <Icon name="pencil" />
  </Button>
);

const ConfirmTeam = () => {
  Swal.fire({
    text: 'Are you sure you want to save your “Teams” changes?',
    confirmButtonText: 'Confirm',
    showCancelButton: true,
    cancelButtonText: 'Return',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Team updated!', 'Team formation has been updated', 'success');
    }
  });
};

const TeamModal: FC<ModalProps> = ({ ...rest }): ReactElement => {
  // const { teams } = useTeams();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      size="tiny"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<TeamModalTrigger />}
      className="team-modal"
      {...rest}
    >
      <Modal.Header>Edit Teams</Modal.Header>
      <Modal.Content>
        <div className="lines">
        <div className="color-pick">
          <input type="color" value="#3d4f91" />
        </div>
        <Input type="text" defaultValue="Editing" />
        </div>
        <div className="lines">
        <div className="color-pick">
          <input type="color" value="#3d4f91" />
        </div>
        <Input type="text" defaultValue="Visuals" />
        </div>
        {/* <Form id="submit-team">
          {teams.map((team, index) => (
              <div key={index}>
                  <Input value={team.color} type="color" />
                  <Input defaultValue = {team.name} type = "text"/>
              </div>
          ))}
          <div>
              <Icon name="plus" />
              <p>Add new team</p>
          </div>
          </Form> */}
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          content="Save"
          form="submit-team"
          className="save-button"
          onClick={ConfirmTeam}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default TeamModal;

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

const TestData: { name: string; color: string }[] = [
  { name: 'Test1', color: 'blue' },
  { name: 'Test2', color: 'orange' },
];

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
interface NewTeamType {
  _id: string;
  name: string;
  color: string;
  active: boolean;
}

const teams: NewTeamType[] = [
  {
    _id: '5jfjaskdjfjasdf',
    name: 'Editing',
    color: '#E7F2FC',
    active: true,
  },
  {
    _id: '5jfjaskdjfjasdf',
    name: 'Writing',
    color: '#FFECE4',
    active: true,
  },
  {
    _id: '5jfjaskdjfjasdf',
    name: 'cat',
    color: 'F6EEFC',
    active: true,
  },
];

const copy = [...teams.map((t) => ({ ...t }))];

// changedValues
// newTeams

const TeamModal: FC<ModalProps> = ({ ...rest }): ReactElement => {
  // const { teams } = useTeams();
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<NewTeamType[]>([...teams]);

  const addField = () => {
    setFormValues([
      ...formValues,
      { _id: 'NEW', name: '', color: '#3d4f91', active: true },
    ]);
  };

  const removeField = (i: number) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const updateFieldText = (i: number, text: string) => {
    const formValue = formValues[i];
    formValue.name = text;
    setFormValues([...formValues]);
  };

  const updateFieldColor = (i: number, color: string) => {
    const formValue = formValues[i];
    formValue.name = color;
    setFormValues([...formValues]);
  };

  const saveForm = (): void => {
    console.log(copy);
    const newTeams = formValues.filter((team) => team._id === 'NEW');
    console.log(newTeams);

    const changedValues: typeof newTeams = [];

    copy.forEach((team, index) => {
      if (
        team.name !== formValues[index].name ||
        team.color !== formValues[index].color
      ) {
        changedValues.push(formValues[index]);
      }
    });

    console.log(changedValues);
  };

  return (
    <Modal
      closeIcon
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
        <Form id="submit-team">
          {formValues.map((team, index) => (
            <div key={index} className="lines">
              <div className="color-pick">
                <input type="color" value={team.color} />
              </div>
              <Input
                type="text"
                onChange={(e, { value }) => updateFieldText(index, value)}
                value={team.name}
                disabled={team.name === 'Editing' || team.name === 'Writing'}
              />
              {team._id === 'NEW' && (
                <Icon
                  name="minus square outline"
                  onClick={() => removeField(index)}
                />
              )}
            </div>
          ))}
          <Button className="addTeam" onClick={addField}>
            <Icon name="plus square outline" />
            <p>Add a new team</p>
          </Button>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          content="Save"
          form="submit-team"
          className="save-button"
          onClick={saveForm}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default TeamModal;

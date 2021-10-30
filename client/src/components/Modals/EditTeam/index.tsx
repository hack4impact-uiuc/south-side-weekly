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

import { ITeam } from 'ssw-common';

import './styles.scss';
import { useTeams } from '../../../contexts';
import { createManyTeams, updateManyTeams } from '../../../api';
import { useEffect } from 'react';

// interface TeamModalProps extends ModalProps {}

const TeamModalTrigger: FC<ButtonProps> = ({ ...rest }): ReactElement => (
  <Button {...rest} icon>
    <Icon name="pencil" />
  </Button>
);

// const copy = [...teams.map((t) => ({ ...t }))];

const TeamModal: FC<ModalProps> = ({ ...rest }): ReactElement => {
  const { teams, fetchTeams } = useTeams();
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<ITeam[]>([]);

  const [clonedTeams, setClonedTeams] = useState<Partial<ITeam>[]>([]);

  useEffect(() => {
    fetchTeams();
    setFormValues(teams);

    const clone = teams.map(team => ({
      _id: team._id,
      name: team.name,
      color: team.color,
      active: team.active
    }));

    setClonedTeams([...clone])
    console.log(teams);
  }, [isOpen])


  // Add a new field in form
  const addField = () => {
    setFormValues([
      ...formValues,
      { _id: 'NEW', name: '', color: '#3d4f91', active: true },
    ]);
  };

  // Remove a field in form
  const removeField = (i: number) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  // Update team names (input type = text)
  const updateFieldText = (i: number, text: string) => {
    const formValue = formValues[i];
    formValue.name = text;
    setFormValues([...formValues]);
  };

  // Update team colors (input type = color)
  const updateFieldColor = (i: number, color: string) => {
    const formValue = formValues[i];
    formValue.color = color;
    setFormValues([...formValues]);
  };

  // Save newTeams and changedTeams
  const saveForm = (): void => {
    const newTeams = formValues.filter((team) => team._id === 'NEW');
    const parsedNewTeams: Partial<ITeam>[] = newTeams.map(({ _id, ...rest }) => rest);

    const changedTeams: ITeam[] = [];

    clonedTeams.forEach((team, index) => {
      if (
        team.name !== formValues[index].name ||
        team.color !== formValues[index].color
      ) {
        changedTeams.push(formValues[index]);
      }
    });

    // Check if the changedTeam names is in cloned Teams
    // Check if the new team names
    
    Swal.fire({
      icon: 'question',
      text: 'Are you sure you want to save your “Teams” changes?',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        createManyTeams(parsedNewTeams);
        updateManyTeams(changedTeams);

        setIsOpen(false);
        fetchTeams();
        setFormValues([]);

        Swal.fire('Team updated!', 'Team formation has been updated', 'success');
      }
    });
  };

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
        <Form id="submit-team">
          {formValues.map((team, index) => (
            <div key={index} className="lines">
              <div className="color-pick">
                <input
                  type="color"
                  value={team.color}
                  onChange={(e) =>
                    updateFieldColor(index, e.currentTarget.value)
                  }
                />
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

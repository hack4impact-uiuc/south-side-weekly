import React, { ReactElement, FC, useState, useEffect } from 'react';
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

const TeamModalTrigger: FC<ButtonProps> = ({ ...rest }): ReactElement => (
  <Button {...rest} size="tiny" circular icon style={{ background: 'none' }}>
    <Icon name="pencil" />
  </Button>
);

const TeamModal: FC<ModalProps> = ({ ...rest }): ReactElement => {
  const { teams, fetchTeams } = useTeams();
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<ITeam[]>([]);

  const [clonedTeams, setClonedTeams] = useState<Partial<ITeam>[]>([]);

  useEffect(() => {
    setFormValues(teams);
    const clone = teams.map((team) => ({
      _id: team._id,
      name: team.name,
      color: team.color,
      active: team.active,
    }));

    setClonedTeams([...clone]);
    fetchTeams();

    // DON'T DO THIS UNLESS AMIT SAYS SO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Add a new input field in form
  const addInputLine = (): void => {
    setFormValues([
      ...formValues,
      { _id: 'NEW', name: '', color: '#3d4f91', active: true },
    ]);
  };

  // Remove an input field in form
  const removeInputLine = (i: number): void => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  // Update team names (input type = text)
  const updateInputText = (i: number, text: string): void => {
    const formValue = formValues[i];
    formValue.name = text;
    setFormValues([...formValues]);
  };

  // Update team colors (input type = color)
  const updateInputColor = (i: number, color: string): void => {
    const formValue = formValues[i];
    formValue.color = color;
    setFormValues([...formValues]);
  };

  // Check if team name inputs contain duplicates
  const isDuplicate = (): boolean => {
    const valuesName = formValues.map((item) => item.name);
    return valuesName.some((item, idx) => valuesName.indexOf(item) !== idx);
  };

  // Save newTeams and changedTeams
  const saveTeam = (): void => {
    // Save newly created teams in newTeams
    const newTeams = formValues.filter((team) => team._id === 'NEW');
    // Take out _id = "NEW" field from newTeams
    const parsedNewTeams: Partial<ITeam>[] = newTeams.map((team) => ({
      name: team.name,
      color: team.color,
      active: team.active,
    }));

    // Save the changes made to existing team in changedTeams
    const changedTeams: ITeam[] = [];

    clonedTeams.forEach((team, index) => {
      const diffName = team.name !== formValues[index].name;
      const diffColor = team.color !== formValues[index].color;
      if (diffName || diffColor) {
        changedTeams.push(formValues[index]);
      }
    });

    // Alert duplicates
    if (isDuplicate()) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot create duplicate team name!',
      });
      return;
    }

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

        Swal.fire(
          'Team updated!',
          'Team formation has been updated',
          'success',
        );
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
        <Form id="submit-team" onSubmit={saveTeam}>
          {formValues.map((team, index) => (
            <div key={index} className="lines">
              <div className="color-pick">
                <input
                  type="color"
                  value={team.color}
                  onChange={(e) =>
                    updateInputColor(index, e.currentTarget.value)
                  }
                />
              </div>
              <Input
                type="text"
                onChange={(e, { value }) => updateInputText(index, value)}
                value={team.name}
                disabled={team.name === 'Editing' || team.name === 'Writing'}
              />
              {team._id === 'NEW' && (
                <Icon
                  name="minus square outline"
                  onClick={() => removeInputLine(index)}
                />
              )}
            </div>
          ))}
          <Button type="button" className="addTeam" onClick={addInputLine}>
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
          onClick={saveTeam}
          style={{ backgroundColor: 'black' }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default TeamModal;

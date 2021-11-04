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
import { IInterest } from 'ssw-common';

import './styles.scss';
import { useInterests } from '../../../contexts';
// TODO
import { createManyInterests, updateManyInterests } from '../../../api';

const InterestsModalTrigger: FC<ButtonProps> = ({ ...rest }): ReactElement => (
  <Button {...rest} size="tiny" circular icon style={{ background: 'none' }}>
    <Icon name="pencil" />
  </Button>
);

const InterestsModal: FC<ModalProps> = ({ ...rest }): ReactElement => {
  const { interests, fetchInterests } = useInterests();
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<IInterest[]>([]);

  const [clonedInterests, setClonedInterests] = useState<Partial<IInterest>[]>(
    [],
  );

  useEffect(() => {
    fetchInterests();
    setFormValues(interests);

    const clone = interests.map((interest) => ({
      _id: interest._id,
      name: interest.name,
      color: interest.color,
      active: interest.active,
    }));

    setClonedInterests([...clone]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, fetchInterests]);

  // Add a new field in form
  const addField = (): void => {
    setFormValues([
      ...formValues,
      { _id: 'NEW', name: '', color: '#3d4f91', active: true },
    ]);
  };

  // Remove a field in form
  const removeField = (i: number): void => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  // Update interest names (input type = text)
  const updateFieldText = (i: number, text: string): void => {
    const formValue = formValues[i];
    formValue.name = text;
    setFormValues([...formValues]);
  };

  // Update interest colors (input type = color)
  const updateFieldColor = (i: number, color: string): void => {
    const formValue = formValues[i];
    formValue.color = color;
    setFormValues([...formValues]);
  };

  // Save newInterests and changedInterests
  const saveInterest = (): void => {
    // Save newly created interests in newInterests
    const newInterests = formValues.filter(
      (interest) => interest._id === 'NEW',
    );
    // Take out _id = "NEW" field from newInterests
    const parsedNewInterests: Partial<IInterest>[] = newInterests.map(
      (interest) => ({
        name: interest.name,
        color: interest.color,
        active: interest.active,
      }),
    );

    // Save changes to existing interest in changedInterests
    const changedInterests: IInterest[] = [];

    clonedInterests.forEach((interest, index) => {
      if (
        interest.name !== formValues[index].name ||
        interest.color !== formValues[index].color
      ) {
        changedInterests.push(formValues[index]);
      }
    });

    // Check if the changedInterest names is in cloned Interests
    // Check if the new interest names
    const valuesName = formValues.map((item) => item.name);
    const isDuplicate = valuesName.some(
      (item, idx) => valuesName.indexOf(item) !== idx,
    );
    if (isDuplicate) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot create duplicate interest name!',
      });
      return;
    }

    console.log(changedInterests);

    Swal.fire({
      icon: 'question',
      text: 'Are you sure you want to save your “Interests” changes?',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        createManyInterests(parsedNewInterests);
        updateManyInterests(changedInterests);

        setIsOpen(false);
        fetchInterests();
        setFormValues([]);

        Swal.fire(
          'Interest updated!',
          'Interest formation has been updated',
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
      trigger={<InterestsModalTrigger />}
      className="interests-modal"
      {...rest}
    >
      <Modal.Header>Edit Interests</Modal.Header>
      <Modal.Content scrolling>
        <Form id="submit-interests">
          {formValues.map((interest, index) => (
            <div key={index} className="lines">
              <div className="color-pick">
                <input
                  type="color"
                  value={interest.color}
                  onChange={(e) =>
                    updateFieldColor(index, e.currentTarget.value)
                  }
                />
              </div>
              <Input
                type="text"
                onChange={(e, { value }) => updateFieldText(index, value)}
                value={interest.name}
              />
              {interest._id === 'NEW' && (
                <Icon
                  name="minus square outline"
                  onClick={() => removeField(index)}
                />
              )}
            </div>
          ))}
          <Button className="addInterest" onClick={addField}>
            <Icon name="plus square outline" />
            <p>Add a new interest</p>
          </Button>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          content="Save"
          form="submit-interests"
          className="save-button"
          onClick={saveInterest}
          style={{ backgroundColor: 'black' }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default InterestsModal;

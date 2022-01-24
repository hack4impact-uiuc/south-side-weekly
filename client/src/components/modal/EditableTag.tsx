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
import { Interest, Team } from 'ssw-common';
import Swal from 'sweetalert2';

import { PrimaryButton } from '../ui/PrimaryButton';
import { Pusher } from '../ui/Pusher';

import './EditableTag.scss';

type Tag = Interest | Team;

interface EditableTagModalProps extends ModalProps {
  title: string;
  allTags: Tag[];
  onCreate: (tags: Partial<Tag>[]) => void;
  onUpdate: (tags: Tag[]) => void;
  onFetch: () => void;
}

const EditableTagModal: FC<EditableTagModalProps> = ({
  title,
  allTags,
  onCreate,
  onUpdate,
  onFetch,
  ...rest
}): ReactElement => {
  const [formValues, setFormValues] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [clonedTags, setClonedTags] = useState<Partial<Tag>[]>([]);

  useEffect(() => {
    setFormValues(allTags);

    const clone = allTags.map((tag) => ({
      _id: tag._id,
      name: tag.name,
      color: tag.color,
      active: tag.active,
    }));

    setClonedTags([...clone]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFetch]);

  // Add a new field in form
  const addInputLine = (): void => {
    setFormValues([
      ...formValues,
      { _id: 'NEW', name: '', color: '#3d4f91', active: true },
    ]);
  };

  const ModalTrigger: FC<ButtonProps> = ({ ...rest }): ReactElement => (
    <Button {...rest} size="tiny" circular icon style={{ background: 'none' }}>
      <Icon name="pencil" />
    </Button>
  );

  // Remove a field in form
  const removeField = (i: number): void => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  // Update input names (input type = text)
  const updateInputText = (i: number, text: string): void => {
    const formValue = formValues[i];
    formValue.name = text;
    setFormValues([...formValues]);
  };

  // Update input colors (input type = color)
  const updateInputColor = (i: number, color: string): void => {
    const formValue = formValues[i];
    formValue.color = color;
    setFormValues([...formValues]);
  };

  // Check if input contain duplicates
  const isDuplicate = (): boolean => {
    const valuesName = formValues.map((item) => item.name);
    return valuesName.some((item, idx) => valuesName.indexOf(item) !== idx);
  };

  // Save newTags and changedTags
  const saveForm = (): void => {
    // Save newly created tags in newTags
    const newTags = formValues.filter((tag) => tag._id === 'NEW');
    // Take out _id = "NEW" field from newTags
    const parsedNewTags: Partial<Tag>[] = newTags.map((tag) => ({
      name: tag.name,
      color: tag.color,
      active: tag.active,
    }));

    // Save the changes made to existing tags in changedTags
    const changedTags: Tag[] = [];

    clonedTags.forEach((tag, index) => {
      const diffName = tag.name !== formValues[index].name;
      const diffColor = tag.color !== formValues[index].color;
      if (diffName || diffColor) {
        changedTags.push(formValues[index]);
      }
    });

    // Alert duplicates
    if (isDuplicate()) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot create duplicate tag name!',
      });
      return;
    }

    Swal.fire({
      icon: 'question',
      text: `Are you sure you want to save your ${title} changes?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        if (parsedNewTags.length) {
          onCreate(parsedNewTags);
        }
        if (changedTags.length) {
          onUpdate(changedTags);
        }
        onFetch();

        Swal.fire(
          `${title} updated!`,
          `${title} tags has been updated`,
          'success',
        );
        setIsOpen(false);
      }
    });
  };

  const NUM_RESTRICTED_TAGS = 2;

  return (
    <Modal
      size="tiny"
      trigger={<ModalTrigger />}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      className="tags-modal"
      {...rest}
    >
      <Modal.Header>
        <span>Edit {title}</span>
        <Pusher />
        <Icon id="close-icon" name="times" onClick={() => setIsOpen(false)} />
      </Modal.Header>
      <Modal.Content scrolling>
        <Form id="submit-tags" onSubmit={saveForm}>
          {formValues.map((value, index) => (
            <div key={index} className="lines">
              <div className="color-pick">
                <input
                  type="color"
                  value={value.color}
                  onChange={(e) =>
                    updateInputColor(index, e.currentTarget.value)
                  }
                />
              </div>
              <Input
                type="text"
                onChange={(e, { value }) => updateInputText(index, value)}
                value={value.name}
                disabled={
                  (value.name === 'Editing' || value.name === 'Writing') &&
                  index < NUM_RESTRICTED_TAGS
                }
              />
              {value._id === 'NEW' && (
                <Icon
                  name="minus square outline"
                  onClick={() => removeField(index)}
                />
              )}
            </div>
          ))}
          <Button type="button" className="addvalue" onClick={addInputLine}>
            <Icon name="plus square outline" />
            <p>
              Add a new {title.substring(0, title.length - 1).toLowerCase()}
            </p>
          </Button>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <PrimaryButton type="submit" content="Save" form="submit-tags" />
      </Modal.Actions>
    </Modal>
  );
};

export default EditableTagModal;

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

import './styles.scss';

const ModalTrigger: FC<ButtonProps> = ({ ...rest }): ReactElement => (
  <Button {...rest} size="tiny" circular icon style={{ background: 'none' }}>
    <Icon name="pencil" />
  </Button>
);

// A tag will have the same interface as IInterest and ITema
interface Tag {
  _id: string;
  name: string;
  color: string;
  active: boolean;
}

interface EditableTagModalProps extends ModalProps {
  title: string;
  allTags: Tag[];
  onCreate: (tags: Partial<Tag>[]) => void;
  onUpdate: (tags: Tag[]) => void;
}

const EditableTagModal: FC<EditableTagModalProps> = ({
  title,
  allTags,
  onCreate,
  onUpdate,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<Tag[]>([]);

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
  }, [isOpen]);

  // Add a new field in form
  const addInputLine = (): void => {
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
        onCreate(parsedNewTags);
        onUpdate(changedTags);

        setIsOpen(false);
        setFormValues([]);

        Swal.fire(
          `${title} updated!`,
          `${title} tags has been updated`,
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
      trigger={<ModalTrigger />}
      className="tags-modal"
      {...rest}
    >
      <Modal.Header>Edit {title}</Modal.Header>
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
        <Button
          type="submit"
          content="Save"
          form="submit-tags"
          className="save-button"
          style={{ backgroundColor: 'black' }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default EditableTagModal;

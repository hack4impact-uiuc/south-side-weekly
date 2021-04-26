import React, { ReactElement, FC, Dispatch, useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Checkbox } from 'semantic-ui-react';

import { createResource, isError } from '../../utils/apiWrapper';

import '../../css/AddResourceModal.css';

const teams = [
  'General',
  'Editing',
  'Factchecking',
  'Illustration',
  'Photography',
  'Onboarding',
  'Visuals',
  'Writing',
];

interface IProps {
  onAdd: Dispatch<void>;
}

const AddResourceModal: FC<IProps> = ({ onAdd }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [resourceTitle, setResourceTitle] = useState<string>('');
  const [resourceURL, setResourceURL] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const handleTagSelect = (tag: string): void => {
    const newTags = new Set(selectedTags);
    newTags.has(tag) ? newTags.delete(tag) : newTags.add(tag);
    setSelectedTags(newTags);
  };

  useEffect(() => {
    // Clears selectedTags upon rendering
    setSelectedTags(new Set<string>());
  }, [open]);

  const addResource = async (): Promise<void> => {
    const newResource = {
      name: resourceTitle !== '' ? resourceTitle : null,
      link: resourceURL !== '' ? resourceURL : null,
      teamRoles: Array.from(selectedTags),
    };

    const res = await createResource(newResource);
    if (!isError(res)) {
      setOpen(false);
      onAdd();
    }
  };

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
                <Input
                  className="edit-resource-label"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.currentTarget.value)}
                />
              </Form.Field>
              <Form.Field>
                URL/File Upload
                <Input
                  className="edit-resource-label"
                  value={resourceURL}
                  onChange={(e) => setResourceURL(e.currentTarget.value)}
                />
              </Form.Field>
            </div>

            <div className="resource-tags-wrapper">
              Resource Tags:
              <div className="resource-tag-grid">
                {teams.map((team, idx) => (
                  <Checkbox
                    key={idx}
                    label={team}
                    onClick={() => handleTagSelect(team)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-add-button">
            <Button type="submit" onClick={addResource}>
              Add Resource
            </Button>
          </div>
        </Form>
      </Modal.Actions>
    </Modal>
  );
};

export default AddResourceModal;

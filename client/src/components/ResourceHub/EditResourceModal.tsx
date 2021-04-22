import React, { ReactElement, FC, Dispatch, useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Checkbox } from 'semantic-ui-react';
import { IResource } from 'ssw-common';

import { editResource, isError } from '../../utils/apiWrapper';

import '../../css/EditResourceModal.css';

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
  isOpen: boolean;
  resource?: IResource;
  closeModal: Dispatch<void>;
}

const EditResourceModal: FC<IProps> = ({
  isOpen,
  resource,
  closeModal,
}): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [resourceURL, setResourceURL] = useState<string>(
    resource ? resource.link : '',
  );
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const handleTagSelect = (tag: string): void => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  useEffect(() => {
    if (resource) {
      // Populate selectedTags set with resource's current teams
      const newTags = new Set<string>();
      for (const idx in Object.keys(resource.teamRoles)) {
        newTags.add(resource.teamRoles[idx]);
        setSelectedTags(newTags);
      }
    }
  }, [resource]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const modifyResource = async (): Promise<void> => {
    const editedResource = {
      name: resource ? resource.name : null,
      link: resourceURL,
      teamRoles: Array.from(selectedTags),
    };

    const res = await editResource(resource?._id, editedResource);
    if (!isError(res)) {
      setOpen(false);
    }
  };

  const close = (): void => {
    setOpen(false);
    closeModal();
  };

  const isTeam = (team: string): boolean => {
    if (resource) {
      return selectedTags.has(team);
    }
    return false;
  };

  return (
    <Modal onClose={close} onOpen={() => setOpen(true)} open={open} closeIcon>
      <Modal.Actions>
        <Form className="edit-resource-wrapper">
          <div className="edit-resource-content">
            <div className="edit-resource-left">
              {resource ? resource.name : ''}
            </div>
            <div className="edit-resource-right">
              <div className="resource-tags-wrapper">
                Resource Tags:
                <div className="resource-tag-grid">
                  {teams.map((team, idx) => (
                    <Checkbox
                      key={idx}
                      label={team}
                      onClick={() => handleTagSelect(team)}
                      defaultChecked={isTeam(team)}
                    />
                  ))}
                </div>
                <div className="edit-resource-inputs">
                  <Form.Field>
                    Description
                    <Input className="edit-resource-label" />
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
                <div className="edit-resource-btns">
                  <div className="edit-resource-save-btn">
                    <Button type="submit" onClick={modifyResource}>
                      Save Changes
                    </Button>
                  </div>
                  <div className="edit-resource-discard-btn">
                    <Button type="cancel" onClick={close}>
                      Discard Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Modal.Actions>
    </Modal>
  );
};

export default EditResourceModal;

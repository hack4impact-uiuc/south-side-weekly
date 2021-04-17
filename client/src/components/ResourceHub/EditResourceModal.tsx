import React, { ReactElement, FC, Dispatch, useEffect } from 'react';
import { Modal, Button, Form, Input } from 'semantic-ui-react';
import { IResource } from 'ssw-common';

import { editResource, isError } from '../../utils/apiWrapper';

import '../../css/EditResourceModal.css';

const teamColors: { [key: string]: string } = {
  General: '#EF8B8B',
  Editing: '#A5C4F2',
  Factchecking: '#CFE7C4',
  Illustration: '#BAB9E9',
  Photography: '#D8ACE8',
  Onboarding: '#F1D8B0',
  Visuals: '#BFEBE0',
  Writing: '#A9D3E5',
};

interface IProps {
  isOpen: boolean;
  resource: IResource | null;
  closeModal: Dispatch<void>;
}

const EditResourceModal: FC<IProps> = ({
  isOpen,
  resource,
  closeModal,
}): ReactElement => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [resourceURL, setResourceURL] = React.useState<string>('');
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(
    new Set(),
  );

  const handleTagSelect = (tag: string): void => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  async function modifyResource(): Promise<void> {
    const editedResource = {
      name: resource ? resource.name : null,
      link: resourceURL !== '' ? resourceURL : null,
      teamRoles: Array.from(selectedTags),
    };

    console.log(editedResource);

    const res = await editResource(resource?._id, editedResource);
    if (!isError(res)) {
      setOpen(false);
    }
  }

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  function close(): void {
    setOpen(false);
    closeModal();
  }

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
                  {Object.keys(teamColors).map((button, idx) => (
                    <Button
                      key={idx}
                      className={`resource-tag ${
                        selectedTags.has(button) ? 'active' : 'false'
                      }`}
                      content={button}
                      style={{ backgroundColor: teamColors[button] }}
                      onClick={() => handleTagSelect(button)}
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

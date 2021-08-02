import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Form, Modal, ModalProps } from 'semantic-ui-react';
import { IResource } from 'ssw-common';
import Swal from 'sweetalert2';

import { createResource, editResource, isError } from '../../../api';
import { allTeams } from '../../../utils/constants';
import './styles.scss';
import { titleCase } from '../../../utils/helpers';

interface ResourceProps extends ModalProps {
  resource?: IResource;
  action: 'create' | 'edit';
  closeModal: () => void;
}

interface FormData {
  name: string;
  link: string;
  tags: Set<string>;
}

interface RequestBody {
  name: string;
  link: string;
  teamRoles: string[];
}

const defaultData: FormData = {
  name: '',
  link: '',
  tags: new Set(),
};

const ResourceModal: FC<ResourceProps> = ({
  resource,
  action,
  closeModal = () => void 0,
  ...rest
}): ReactElement => {
  const [formData, setFormData] = useState<FormData>(defaultData);

  // Resets the form data on every open
  useEffect(() => {
    const data: FormData = {
      name: '',
      link: '',
      tags: new Set(),
    };
    setFormData({ ...data });
  }, [rest.open]);

  useEffect(() => {
    if (action === 'edit' && resource) {
      const body = {
        name: resource.name,
        link: resource.link,
        tags: new Set(resource.teamRoles),
      };

      setFormData({ ...body });
    }
  }, [resource, action]);

  const parseFormData = (data: FormData): RequestBody => ({
    name: data.name,
    link: data.link,
    teamRoles: Array.from(data.tags),
  });

  const updateResource = async (): Promise<void> => {
    await editResource(resource?._id, {
      ...parseFormData(formData),
    });
    closeModal();
    Swal.fire({
      title: 'Successfully updated resource',
      icon: 'success',
    });
  };

  const submitResource = async (): Promise<void> => {
    const body = {
      name: formData.name,
      link: formData.link,
      teamRoles: Array.from(formData.tags),
    };

    const res = await createResource({ ...body });

    if (isError(res)) {
      Swal.fire({
        title: 'Resource already exists!',
        icon: 'error',
        text: 'Modify the name and/or link to be a unique resource',
      });
    } else {
      closeModal();
    }
  };

  const getSelectedTeams = (tag: string): Set<string> => {
    const tags = formData.tags;
    tags.has(tag) ? tags.delete(tag) : tags.add(tag);
    return tags;
  };

  const teams = (): string[] => ['General', ...allTeams].map(titleCase);

  const changeField = <T extends keyof FormData>(
    key: T,
    value: FormData[T],
  ): void => {
    const data = { ...formData };
    data[key] = value;
    setFormData(data);
  };

  return (
    <Modal className="resource-modal" {...rest}>
      <Modal.Header content="Resource Control" />
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Input
              required
              label="Name"
              type="text"
              value={formData.name}
              onChange={(e, { value }) => changeField('name', value)}
            />
            <Form.Input
              required
              label="Link"
              type="text"
              value={formData.link}
              onChange={(e, { value }) => changeField('link', value)}
            />
            <h3>Teams</h3>
            <Form.Group className="checkbox-group">
              {teams().map((team, index) => (
                <Form.Checkbox
                  key={index}
                  label={team}
                  value={team}
                  checked={formData.tags.has(team)}
                  onChange={(e, { value }) =>
                    changeField('tags', getSelectedTeams(`${value}`))
                  }
                />
              ))}
            </Form.Group>
          </Form>
        </Modal.Description>
        <Modal.Actions>
          <Form.Button
            className="submit-btn"
            content={action === 'edit' ? 'Save Resource' : 'Create Resource'}
            type="submit"
            onClick={() =>
              action === 'create' ? submitResource() : updateResource()
            }
          />
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default ResourceModal;
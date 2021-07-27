import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Form, Modal, ModalProps } from 'semantic-ui-react';
import { IResource } from 'ssw-common';
import { startCase } from 'lodash';

import { createResource, editResource } from '../../../api';
import { allTeams } from '../../../utils/constants';
import './styles.scss';

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

const ResourceModal: FC<ResourceProps> = ({
  resource,
  action,
  closeModal = () => void 0,
  ...rest
}): ReactElement => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    link: '',
    tags: new Set(),
  });

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
  };

  const submitResource = async (): Promise<void> => {
    const body = {
      name: formData.name,
      link: formData.link,
      teamRoles: Array.from(formData.tags),
    };

    await createResource({ ...body });
    closeModal();
  };

  const getSelectedTeams = (tag: string): Set<string> => {
    const tags = formData.tags;

    tags.has(tag) ? tags.delete(tag) : tags.add(tag);

    return tags;
  };

  const teams = (): string[] =>
    ['General', ...allTeams].map((team) => startCase(team.toLowerCase()));

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

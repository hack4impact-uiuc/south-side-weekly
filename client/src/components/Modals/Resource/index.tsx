import React, { FC, FormEvent, ReactElement, useEffect, useState } from 'react';
import { CheckboxProps, Form, Modal, ModalProps } from 'semantic-ui-react';
import { IResource, ITeam } from 'ssw-common';
import Swal from 'sweetalert2';

import { createResource, editResource, isError } from '../../../api';
import './styles.scss';
import { useTeams } from '../../../contexts';

interface ResourceProps extends ModalProps {
  resource?: IResource;
  action: 'create' | 'edit';
  closeModal: () => void;
}

interface FormData {
  name: string;
  link: string;
  tags: Set<string>;
  isGeneral: boolean;
}
const defaultData: FormData = {
  name: '',
  link: '',
  tags: new Set(),
  isGeneral: false,
};

const generalTeam: ITeam = {
  _id: 'General',
  name: 'General',
  color: '',
  active: false,
};

const ResourceModal: FC<ResourceProps> = ({
  resource,
  action,
  closeModal = () => void 0,
  ...rest
}): ReactElement => {
  const [formData, setFormData] = useState<FormData>(defaultData);

  let { teams: allTeams } = useTeams();
  allTeams = [generalTeam, ...allTeams];

  // Resets the form data on every open
  useEffect(() => {
    const data: FormData = {
      name: '',
      link: '',
      tags: new Set(),
      isGeneral: false,
    };
    setFormData({ ...data });
  }, [rest.open]);

  useEffect(() => {
    if (action === 'edit' && resource) {
      const body = {
        name: resource.name,
        link: resource.link,
        tags: new Set(resource.teams),
        isGeneral: resource.isGeneral,
      };

      setFormData({ ...body });
    }
  }, [resource, action]);

  const parseFormData = (data: FormData): Partial<IResource> => ({
    name: data.name,
    link: data.link,
    teams: Array.from(data.tags),
    isGeneral: data.isGeneral,
  });

  const updateResource = async (): Promise<void> => {
    if (resource) {
      await editResource(resource._id, {
        ...parseFormData(formData),
      });
      closeModal();
      Swal.fire({
        title: 'Successfully updated resource',
        icon: 'success',
      });
    }
  };

  const submitResource = async (): Promise<void> => {
    const res = await createResource({ ...parseFormData(formData) });

    if (isError(res)) {
      Swal.fire({
        title: 'Resource already exists!',
        icon: 'error',
        text: 'Modify the name and/or link to be a unique resource',
      });
    } else {
      closeModal();
      Swal.fire({
        title: 'Successfully created resource',
        icon: 'success',
      });
    }
  };

  const getSelectedTeams = (tag: string): Set<string> => {
    const tags = formData.tags;
    tags.has(tag) ? tags.delete(tag) : tags.add(tag);
    return tags;
  };

  const changeField = <T extends keyof FormData>(
    key: T,
    value: FormData[T],
  ): void => {
    const data = { ...formData };
    data[key] = value;
    setFormData(data);
  };

  const isChecked = (teamId: string): boolean => {
    if (teamId === 'General') {
      return formData.isGeneral;
    }
    return formData.tags.has(teamId);
  };

  const onChecked = (team: ITeam, { value }: CheckboxProps): void =>
    team._id === 'General'
      ? changeField('isGeneral', !formData.isGeneral)
      : changeField('tags', getSelectedTeams(`${value}`));

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
              {allTeams.map((team, index) => (
                <Form.Checkbox
                  key={index}
                  label={team.name}
                  value={team._id}
                  checked={isChecked(team._id)}
                  onChange={(_, value) => onChecked(team, value)}
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

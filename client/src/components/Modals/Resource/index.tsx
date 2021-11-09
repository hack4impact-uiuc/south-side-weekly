import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Form, Modal, ModalProps } from 'semantic-ui-react';
import { IResource } from 'ssw-common';
import Swal from 'sweetalert2';

import { createResource, editResource, isError } from '../../../api';
import './styles.scss';
import { visibilityEnum } from '../../../utils/enums';
import TeamsSelect from '../../Dropdowns/TeamsSelect';

interface ResourceProps extends ModalProps {
  resource?: IResource;
  action: 'create' | 'edit';
  closeModal: () => void;
}

interface FormData {
  name: string;
  link: string;
  teams: string[];
  isGeneral: boolean;
  visibility: string;
}

const defaultData: FormData = {
  name: '',
  link: '',
  teams: [],
  isGeneral: false,
  visibility: '',
};

const ResourceModal: FC<ResourceProps> = ({
  resource,
  action,
  closeModal = () => void 0,
  ...rest
}): ReactElement => {
  const [formData, setFormData] = useState<FormData>({
    ...defaultData,
  });

  // Resets the form data on every open
  useEffect(() => {
    setFormData({ ...defaultData });
  }, [rest.open]);

  useEffect(() => {
    if (action === 'edit' && resource) {
      const body = {
        name: resource.name,
        link: resource.link,
        teams: resource.teams,
        isGeneral: resource.isGeneral,
        visibility: resource.visibility,
      };

      setFormData({ ...body });
    }
  }, [resource, action]);

  const parseFormData = (data: FormData): Partial<IResource> => ({
    name: data.name,
    link: data.link,
    teams: data.teams,
    isGeneral: data.isGeneral,
    visibility: data.visibility,
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
              label="Name"
              type="text"
              value={formData.name}
              onChange={(e, { value }) => changeField('name', value)}
            />
            <Form.Input
              label="Link"
              type="text"
              value={formData.link}
              onChange={(e, { value }) => changeField('link', value)}
            />
            <h4>Teams</h4>
            <TeamsSelect
              values={formData.teams}
              onChange={(values) =>
                changeField(
                  'teams',
                  values.map((item) => item.value),
                )
              }
            />
            <h4>Resource Visibility</h4>
            <div className="resource-visibility">
              <Form.Radio
                style={{ marginRight: 20, paddingLeft: 0 }}
                label="Public"
                name="publicOrPrivate"
                value={visibilityEnum.PUBLIC}
                checked={formData.visibility === visibilityEnum.PUBLIC}
                onChange={() =>
                  changeField('visibility', visibilityEnum.PUBLIC)
                }
              />
              <Form.Radio
                label="Private"
                name="publicOrPrivate"
                value="PRIVATE"
                checked={formData.visibility === visibilityEnum.PRIVATE}
                onChange={() =>
                  changeField('visibility', visibilityEnum.PRIVATE)
                }
              />
            </div>
          </Form>
        </Modal.Description>
        <Modal.Actions>
          <Form.Button
            className="submit-btn"
            content={action === 'edit' ? 'Save' : 'Create Resource'}
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

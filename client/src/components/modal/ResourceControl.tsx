import React, { FC, ReactElement, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Form, Icon, Modal, ModalProps } from 'semantic-ui-react';
import { Resource } from 'ssw-common';

import { isError } from '../../api';
import { ResourceForm } from '../form/ResourceForm';
import { apiCall } from '../../api/request';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { Pusher } from '../ui/Pusher';

import './ResourceControl.scss';
import './modals.scss';

interface ResourceProps extends ModalProps {
  resource?: Resource;
  action: 'create' | 'edit';
  closeModal: () => void;
}

const defaultData = {
  _id: '',
  name: '',
  link: '',
  teams: [],
  isGeneral: false,
  visibility: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const ResourceModal: FC<ResourceProps> = ({
  resource,
  action,
  closeModal = () => void 0,
  ...rest
}): ReactElement => {
  const formValues = useMemo(
    () => (action === 'create' || !resource ? defaultData : resource),
    [resource, action],
  );

  const deleteResource = async (): Promise<void> => {
    const { _id } = formValues;

    const res = await apiCall({
      method: 'DELETE',
      url: `/resources/${_id}`,
    });

    if (!isError(res)) {
      toast.success('Resource deleted successfully', {
        position: 'bottom-right',
      });
      closeModal();
    } else {
      toast.error('Error deleting resource', { position: 'bottom-right' });
    }
  };

  const submitResourceForm = (resource: Resource): void => {
    const body = {
      name: resource.name,
      link: resource.link,
      teams: resource.teams,
      isGeneral: resource.isGeneral,
      visibility: resource.visibility,
    };

    const manageResource = async (): Promise<void> => {
      const res = await apiCall({
        url: action === 'create' ? '/resources' : `/resources/${resource._id}`,
        method: action === 'create' ? 'POST' : 'PUT',
        body,
      });

      if (!isError(res)) {
        closeModal();
        toast.success(
          `Successfully ${
            action === 'create' ? 'created' : 'updated'
          } resource`,
          {
            position: 'bottom-right',
          },
        );
      } else {
        toast.error(
          `Error ${action === 'create' ? 'creating' : 'updating'} resource`,
          {
            position: 'bottom-right',
          },
        );
      }
    };

    manageResource();
  };

  return (
    <Modal className="resource-modal" {...rest}>
      <Modal.Header>
        <span>Resource Control</span>
        <Pusher />
        <Icon id="close-icon" name="close" onClick={closeModal} />
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <ResourceForm
            id="resource-form"
            onSubmit={submitResourceForm}
            initialValues={formValues}
          />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Form.Group>
          <PrimaryButton
            className="submit-btn"
            content={action === 'edit' ? 'Save' : 'Create Resource'}
            type="submit"
            form="resource-form"
          />
          {action === 'edit' && (
            <SecondaryButton
              border
              className="delete-btn"
              content="Delete Resource"
              onClick={deleteResource}
            />
          )}
        </Form.Group>
      </Modal.Actions>
    </Modal>
  );
};

export default ResourceModal;
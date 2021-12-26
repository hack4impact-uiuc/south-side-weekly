import React, { FC, ReactElement, useState } from 'react';
import { Button, Icon, Modal, ModalProps } from 'semantic-ui-react';
import toast from 'react-hot-toast';
import { BasePopulatedUser, User } from 'ssw-common';
import _ from 'lodash';

import { isError } from '../../api';
import { useAuth } from '../../contexts';
import { apiCall } from '../../api/request';
import { PrimaryButton } from '../ui/PrimaryButton';
import { Pusher } from '../ui/Pusher';
import { EditUserForm } from '../form/EditUserForm';

import './modals.scss';

interface EditUserProps extends ModalProps {
  user: BasePopulatedUser;
  permissions: {
    view: (keyof User)[];
    edit: (keyof User)[];
  };
}

export const EditUserModal: FC<EditUserProps> = ({
  user,
  permissions,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const { register } = useAuth();

  const updateProfile = async (values: User): Promise<void> => {
    const res = await apiCall({
      method: 'PUT',
      url: `/users/${user._id}`,
      body: _.omitBy(values, _.isUndefined),
    });
    if (!isError(res)) {
      register();
      setIsOpen(false);
      toast.success('Profile updated successfully!', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<Button size="medium" content="Edit Profile" color="black" />}
      className="edit-user-modal"
      {...rest}
    >
      <Modal.Header>
        <span>Edit Profile</span>
        <Pusher />
        <Icon name="close" onClick={() => setIsOpen(false)} />
      </Modal.Header>
      <Modal.Content scrolling>
        <EditUserForm
          permissions={permissions}
          initialValues={user}
          customOnSubmit={updateProfile}
          onSubmit={() => void 0}
          id="edit-user-form"
        />
        <Modal.Actions>
          <PrimaryButton type="submit" form="edit-user-form" content="Save" />
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

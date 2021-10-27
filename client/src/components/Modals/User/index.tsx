import React, { ReactElement, FC, useState } from 'react';
import { toLower } from 'lodash';
import { Button, Grid, Icon, Modal, ModalProps } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import FieldTag from '../../FieldTag';
import { getUserFullName } from '../../../utils/helpers';
import UserCard from '../../UserCard';
import UserPicture from '../../UserPicture';

import './styles.scss';

interface UserModalProps extends ModalProps {
  user: IUser;
}

const UserModal: FC<UserModalProps> = ({ user, ...rest }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const openUserProfile = (): void =>
    window.open(`/profile/${user._id}`)!.focus();

  return (
    <Modal
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={rest.trigger ? rest.trigger : <UserCard user={user} />}
      className="user-modal"
      {...rest}
    >
      <Modal.Header>View User</Modal.Header>
      <Modal.Content image>
        <Grid columns="equal" padded stackable>
          <Grid.Column verticalAlign="middle">
            <Grid.Row>
              <UserPicture size="small" user={user} />
            </Grid.Row>
            <Grid.Row>
              <Button icon className="profile-button" onClick={openUserProfile}>
                <Icon name="external alternate" />
                Open in New Tab
              </Button>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column verticalAlign="middle" width={5}>
            <Grid.Row>
              <h1 className="user-information name">
                <b>{getUserFullName(user)}</b>
              </h1>
            </Grid.Row>
            <Grid.Row>
              <h3 className="user-information role">{toLower(user.role)}</h3>
            </Grid.Row>
            <Grid.Row>
              <h3 className="user-information email">{user.email}</h3>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column>
            <h1 className="list-header">Topics</h1>
            {user.interests.map((interest: string, index: number) => (
              <Grid.Row key={index}>
                <FieldTag className="interest-tag" content={interest} />
              </Grid.Row>
            ))}
          </Grid.Column>
          <Grid.Column>
            <h1 className="list-header">Teams</h1>
            {user.teams.map((team: string, index: number) => (
              <Grid.Row key={index}>
                <FieldTag className="team-tag" content={team} />
              </Grid.Row>
            ))}
          </Grid.Column>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default UserModal;

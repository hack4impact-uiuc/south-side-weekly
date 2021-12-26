import React, { ReactElement, FC } from 'react';
import { toLower } from 'lodash';
import { Button, Grid, Icon, Modal, ModalProps } from 'semantic-ui-react';
import { BasePopulatedUser } from 'ssw-common';

import UserPicture from '../UserPicture';
import { TagList } from '../list/TagList';

import './modals.scss';
import './ViewUser.scss';

interface ViewUserProps extends ModalProps {
  user: BasePopulatedUser;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ViewUserModal: FC<ViewUserProps> = ({
  user,
  open,
  setOpen,
  ...rest
}): ReactElement => (
  <Modal
    open={open}
    onClose={() => setOpen(false)}
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
            <Button
              icon
              className="profile-button"
              onClick={() => window.open(`/profile/${user._id}`)!.focus()}
            >
              <Icon name="external alternate" />
              Open in New Tab
            </Button>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column verticalAlign="middle" width={5}>
          <Grid.Row>
            <h1 className="user-information name">
              <b>{user.fullname}</b>
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
          <TagList tags={user.interests} />
        </Grid.Column>
        <Grid.Column>
          <h1 className="list-header">Teams</h1>
          <TagList tags={user.teams} />
        </Grid.Column>
      </Grid>
    </Modal.Content>
  </Modal>
);

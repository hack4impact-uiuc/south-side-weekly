import React, { FC, ReactElement } from 'react';
import { Modal, Image, Grid, Button, Icon } from 'semantic-ui-react';

import { IUser } from '../../../../common/index';
import '../../css/UserModal.css';
import { interestsColorEnum } from '../../utils/enums';
import DefaultProfile from '../../assets/default_profile.png';
import { getUserFirstName } from '../../utils/helpers';

interface ILabelProps {
  text: string;
}

/**
 * Builds a Label for the User Modal
 *
 * @param text the text to display within the label
 * @returns a formatted label
 */
const ModalLabel: FC<ILabelProps> = ({ text }): ReactElement => {
  /**
   * Determines what color a label should be based on its text
   *
   * @param colorText the text to decipher
   * @returns the hex code of the color to display
   */
  const getLabelColor = (colorText: string): string => {
    const value_index: number = Object.keys(interestsColorEnum).indexOf(
      colorText,
    );

    // Return a default color
    if (value_index < 0) {
      return 'grey';
    }

    return Object.values(interestsColorEnum)[value_index];
  };

  return (
    <div style={{ background: getLabelColor(text) }} className="modal-label">
      {text.toLowerCase()}
    </div>
  );
};

interface IModalProps {
  open: boolean;
  handleClose: () => void;
  user: IUser;
}

const UserModal: FC<IModalProps> = ({
  open,
  handleClose,
  user,
}): ReactElement => {
  /**
   * Opens up a user's profile page according to their ID
   */
  const openUserProfile = (): void => {
    const profileWindow: Window = window.open(`/profile/${user._id}`)!;

    // Switch to this tab
    profileWindow.focus();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Content>
        <Grid columns="equal" padded>
          <Grid.Column verticalAlign="middle">
            <Grid.Row>
              <Image
                circular
                size="small"
                src={user.profilePic ? user.profilePic : DefaultProfile}
                alt={`${getUserFirstName(user)} ${user.lastName}`}
              />
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
                <b>{`${getUserFirstName(user)} ${user.lastName}`}</b>
              </h1>
            </Grid.Row>
            <Grid.Row>
              <h3 className="user-information role">
                {user.role.toLowerCase()}
              </h3>
            </Grid.Row>
            <Grid.Row>
              <h3 className="user-information email">{user.email}</h3>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column>
            <h1 className="list-header">Topics</h1>
            {user.interests.map((interest: string, index: number) => (
              <Grid.Row key={index}>
                <ModalLabel text={interest} />
              </Grid.Row>
            ))}
          </Grid.Column>
          <Grid.Column>
            <h1 className="list-header">Teams</h1>
            {user.currentTeams.map((team: string, index: number) => (
              <Grid.Row key={index}>
                <ModalLabel text={team} />
              </Grid.Row>
            ))}
          </Grid.Column>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default UserModal;

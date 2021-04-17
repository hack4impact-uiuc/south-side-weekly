import React, { FC, ReactElement } from 'react';
import { Modal } from 'semantic-ui-react';

import { IUser } from '../../../../common/index';

interface IProps {
  open: boolean;
  handleClose: () => void;
  user: IUser;
}

const UserModal: FC<IProps> = ({ open, handleClose, user }): ReactElement => (
  <Modal open={open} onClose={handleClose}>
    <Modal.Content>
      <div>{user.firstName}</div>
      <div>{user.lastName}</div>
      <div>{user.preferredName}</div>
      <div>{user.email}</div>
      <div>{user.phone}</div>
      <div>{user.oauthID}</div>
      <div>{user.genders}</div>
      <div>{user.pronouns}</div>
      <div>{user.dateJoined}</div>
      <div>{user.masthead}</div>
      <div>{user.onboarding}</div>
      <img src={user.profilePic} alt={user.firstName} />
      <div>{user.portfolio}</div>
      <div>{user.linkedIn}</div>
      <div>{user.twitter}</div>
      <div>{user.claimedPitches}</div>
      <div>{user.submittedPitches}</div>
      <div>{user.currentTeams}</div>
      <div>{user.role}</div>
      <div>{user.races}</div>
      <div>{user.interests}</div>
    </Modal.Content>
  </Modal>
);

export default UserModal;

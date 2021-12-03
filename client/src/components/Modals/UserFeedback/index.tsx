import React, { ReactElement, FC, useState } from 'react';
import { Button, Grid, Icon, Modal, ModalProps, Rating, Input } from 'semantic-ui-react';
import { IUserFeedback, IUser } from 'ssw-common';

import FieldTag from '../../FieldTag';
import { getUserFullName } from '../../../utils/helpers';
import UserPicture from '../../UserPicture';
import UserChip from '../../UserChip';
import { useInterests, useTeams } from '../../../contexts';

interface UserFeedbackModal extends ModalProps {
    user: IUser;
  }  

const UserFeedbackModal: FC<UserFeedbackModal> = ({user}) : ReactElement =>{
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Modal open={isOpen}>
            <Modal.Header>Leave Feedback</Modal.Header>
            <UserChip user={user}/>
            <Rating maxRating={5} clearable />
            <Input type = "text"></Input>
        </Modal>
    );
}

export default UserFeedbackModal;
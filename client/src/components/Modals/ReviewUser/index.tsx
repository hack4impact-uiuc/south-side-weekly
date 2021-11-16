import React, { ReactElement, FC, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  Grid,
  Modal,
  ModalProps,
  Icon,
  Form,
  Input,
} from 'semantic-ui-react';
import { IUser, ITeam } from 'ssw-common';
import { isError } from 'lodash';

import { updateUser, updateOnboardingStatus } from '../../../api';
import { useInterests, useTeams } from '../../../contexts';
import { UserPicture, FieldTag } from '../..';
import { getUserFullName, titleCase } from '../../../utils/helpers';

import './styles.scss';
interface ReviewUserProps extends ModalProps {
  user: IUser;
}

const ReviewUserModal: FC<ReviewUserProps> = ({ user }): ReactElement => {
  const [isOpen, setIsOpen] = useState(true);
  const [formValue, setFormValue] = useState('');

  const { getTeamFromId } = useTeams();
  const { getInterestById } = useInterests();

  // Toast success
  const notifySuccess = (message: string): string =>
    toast.success(`Successfully ${message} user!`, {
      position: 'bottom-right',
    });

  // Toast fail
  const notifyFail = (message: string): string =>
    toast.success(`${message} user was unsuccessful!`, {
      position: 'bottom-right',
    });

  // Handle approve
  const approveUser = (user: IUser): void => {
    const reasoningAdded = updateUser(
      {
        onboardReasoning: formValue,
      },
      user._id,
    );
    const userApproved = updateOnboardingStatus(user._id, 'ONBOARDED');
    if (!isError(reasoningAdded) && !isError(userApproved)) {
      notifySuccess('approved');
      setIsOpen(false);
    } else {
      notifyFail('Approving');
    }
  };

  // Handle decline
  const declineUser = (user: IUser): void => {
    const reasoningAdded = updateUser(
      {
        onboardReasoning: formValue,
      },
      user._id,
    );
    const userDenied = updateOnboardingStatus(user._id, 'DENIED');
    if (!isError(reasoningAdded) && !isError(userDenied)) {
      notifySuccess('declined');
      setIsOpen(false);
    } else {
      notifyFail('Declining');
    }
  };

  // Convert Date to mm/dd/yyyy format
  const toString = (date: Date): string => {
    const str = date.toLocaleString();
    const dateArr = str.split('T', 1)[0].split('-');
    const dateStr = `${dateArr[1]}/${dateArr[2]}/${dateArr[0]}`;
    return dateStr;
  };

  return (
    <Modal
      size="large"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      className="review-user-modal"
    >
      <Modal.Header>Review User</Modal.Header>
      <Modal.Content>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>
              <div className="user-info">
                <UserPicture className="review-user-picture" user={user} />
                <div className="user-info-text">
                  <b>
                    {user.preferredName
                      ? `${user.preferredName} (${user.firstName} ${user.lastName})`
                      : getUserFullName(user)}
                  </b>
                  <br></br>
                  {user.pronouns.join(', ')}
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="mail" />
              {user.email}
              <br></br>
              <Icon name="phone" />
              {user.phone}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <b>Genders:</b> {user.genders.join(', ')}
              <br /> <b>Races:</b> {titleCase(user.races.join(', '))}
              {/* TODO - update when the neighborhoods field is added to the user model */}
              <br /> <b>Neighborhood:</b> Place Holder, update when the
              neighborhoods field is added to the user model
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={4}>
            <Grid.Column>
              <b>Role</b>
              <br />
              <FieldTag
                className="role-tag"
                content={user.role}
                size="medium"
              />
            </Grid.Column>
            <Grid.Column>
              <b>Teams</b>
              <br />
              {user.teams
                .map(getTeamFromId)
                .map((team: ITeam | undefined, index: number) => (
                  <Grid.Row key={index}>
                    <FieldTag
                      className="team-tag"
                      name={team?.name}
                      hexcode={team?.color}
                      size="medium"
                    />
                  </Grid.Row>
                ))}
            </Grid.Column>
            <Grid.Column>
              <b>Topic Interests</b>
              <br />
              {user.interests.map((interest: string, index: number) => {
                const fullInterest = getInterestById(interest);

                return (
                  <FieldTag
                    className="team-tag"
                    key={index}
                    name={fullInterest?.name}
                    hexcode={fullInterest?.color}
                    size="medium"
                  />
                );
              })}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <div className="paragraph">
                <b>How and why user wants to get involved</b>
                <br />
                {user.involvementResponse}
              </div>
              <div className="paragraph">
                <b>User's past experience</b>
                <br />
                {/* TODO - update when past experience field is added to the user model */}
                Place Holder, update when past experience field is added to the
                user model
              </div>
              <span style={{ color: 'gray' }}>
                Registered on {toString(user.dateJoined)}
              </span>
              <h5>
                Reasoning <span style={{ color: 'gray' }}>- Optional</span>
              </h5>
              <Form>
                <Input
                  type="text"
                  onChange={(e) => setFormValue(e.currentTarget.value)}
                ></Input>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal.Actions>
          <Button
            className="approve-button"
            onClick={() => {
              approveUser(user);
            }}
          >
            Approve
          </Button>
          <Button
            className="decline-button"
            onClick={() => {
              declineUser(user);
            }}
          >
            Decline
          </Button>
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default ReviewUserModal;

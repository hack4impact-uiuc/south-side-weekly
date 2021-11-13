import React, { ReactElement, FC, useState } from 'react';
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

import { updateUser } from '../../../api';
import { useInterests, useTeams } from '../../../contexts';
import { UserPicture, FieldTag } from '../..';
import { onboardingStatusEnum } from '../../../utils/enums';
import Swal from 'sweetalert2';

import './styles.scss';
import { getUserFullName, titleCase } from '../../../utils/helpers';

interface ReviewUserProps extends ModalProps {
  user: IUser;
}

const ReviewUserModal: FC<ReviewUserProps> = ({ user }): ReactElement => {
  const [isOpen, setIsOpen] = useState(true);
  const [formValue, setFormValue] = useState('');

  const { getTeamFromId } = useTeams();
  const { getInterestById } = useInterests();

  const approveUser = (u: IUser): void => {
    u.onboardingStatus = onboardingStatusEnum.ONBOARDED;
    updateUser(u, u._id);
  };

  const rejectUser = (u: IUser): void => {
    updateUser({ onboardingStatus: onboardingStatusEnum.REJECTED }, u._id);
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
              {/* Place Holder To Be Updated */}
              <br /> <b>Neighborhood:</b> Place Holder
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={4}>
            <Grid.Column>
              <b>Role</b>
              <br />
              <FieldTag className="role-tag" content={user.role} size="tiny" />
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
                      size="tiny"
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
                    size="tiny"
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
                {/* Place Holder To Be Updated  */}
                <b>User's past experience</b>
                <br />
                Place Holder.
              </div>
              <span style={{ color: 'gray' }}>Registered on 10/28/2002</span>
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
            className="reject-button"
            onClick={() => {
              rejectUser(user);
            }}
          >
            Reject
          </Button>
          <Button
            className="approve-button"
            onClick={() => {
              approveUser(user);
            }}
          >
            Approve
          </Button>
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default ReviewUserModal;

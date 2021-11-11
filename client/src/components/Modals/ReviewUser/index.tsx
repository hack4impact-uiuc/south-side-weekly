import React, { ReactElement, FC, useState, useEffect } from 'react';
import {
  Button,
  ButtonProps,
  Form,
  Grid,
  Icon,
  Input,
  Modal,
  ModalProps,
} from 'semantic-ui-react';
import { updateOnboardingStatus } from '../../../api';
import { useInterests, useTeams } from '../../../contexts';

import { UserPicture, FieldTag } from '../..';

import { IUser, ITeam } from 'ssw-common';

interface ReviewUserProps extends ModalProps {
  user: IUser;
}

const ReviewUserModal: FC<ReviewUserProps> = ({ user }): ReactElement => {
  const [isOpen, setIsOpen] = useState(true);

  const { getTeamFromId } = useTeams();
  const { getInterestById } = useInterests();

  return (
    <Modal
      size="large"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      <Modal.Header>Yo Review User</Modal.Header>
      <Grid divided="vertically">
        <Grid.Row columns={2}>
          <Grid.Column>
            <UserPicture size="mini" user={user} />
            {user.firstName} {user.lastName}
            <br></br>
            {user.pronouns.join(', ')}
          </Grid.Column>
          <Grid.Column>
            {user.email}
            <br></br>
            {user.phone}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            Genders: {user.genders.join(', ')}
            <br></br>
            Races: {user.races.join(', ')}
            <br></br>
            Neighborhood: what is this
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Column>
            <h5>Role</h5>
            <FieldTag className="role-tag" content={user.role} />
          </Grid.Column>
          <Grid.Column>
            <h5>Teams</h5>
            {user.teams
              .map(getTeamFromId)
              .map((team: ITeam | undefined, index: number) => (
                <Grid.Row key={index}>
                  <FieldTag
                    className="team-tag"
                    name={team?.name}
                    hexcode={team?.color}
                  />
                </Grid.Row>
              ))}
          </Grid.Column>
          <Grid.Column>
            <h5>Topic Interests</h5>
            {user.interests.map((interest: string, index: number) => {
              const fullInterest = getInterestById(interest);

              return (
                <FieldTag
                  className="team-tag"
                  key={index}
                  name={fullInterest?.name}
                  hexcode={fullInterest?.color}
                />
              );
            })}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <h5>How and why user wants to get involved</h5>
            {user.involvementResponse}
            <h5>User's past experience</h5>
            {user.involvementResponse}
            <br></br>
            Registered on [insert time]
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Button onclick={() => updateOnboardingStatus(user._id, 'STALLED')}>
        Reject
      </Button>
      <Button onclick={() => updateOnboardingStatus(user._id, 'ONBOARDED')}>
        Approve
      </Button>
    </Modal>
  );
};

export default ReviewUserModal;

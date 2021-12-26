import React, { ReactElement, FC, useState } from 'react';
import {
  Grid,
  Modal,
  ModalProps,
  Icon,
  Form,
  Message,
} from 'semantic-ui-react';
import { BasePopulatedUser } from 'ssw-common';

import { UserPicture, FieldTag } from '../..';
import { titleCase } from '../../../utils/helpers';
import { onboardingStatusEnum } from '../../../utils/enums';
import { SecondaryButton } from '../../ui/SecondaryButton';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { updateUser } from '../../../api';
import { TagList } from '../../list/TagList';

import './styles.scss';

interface ReviewUserProps extends ModalProps {
  user: BasePopulatedUser;
  actionUpdate?: (
    user: BasePopulatedUser,
    status: keyof typeof onboardingStatusEnum,
  ) => Promise<void>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'reject' | 'review';
}

const ReviewUserModal: FC<ReviewUserProps> = ({
  user,
  actionUpdate,
  open,
  setOpen,
  type,
  ...rest
}): ReactElement => {
  const [onboardReasoning, setOnboardReasoning] = useState('');

  return (
    <Modal
      {...rest}
      size="large"
      open={open}
      onClose={() => setOpen(false)}
      className="review-user-modal"
    >
      <Modal.Header className="review-user-header">
        {type === 'reject' ? 'View Rejected User' : 'Review User'}
      </Modal.Header>
      <Modal.Content>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>
              <div className="user-info">
                <UserPicture className="review-user-picture" user={user} />
                <div className="user-info-text">
                  <b>{user.joinedNames}</b>
                  <br></br>
                  {user.pronouns.join(', ')}
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div>
                <Icon name="mail" />
                {user.email}
              </div>
              <div>
                <Icon name="phone" />
                {user.phone}
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <b>Genders:</b> {user.genders.join(', ')}
              <br /> <b>Races:</b> {user.races.map(titleCase).join(', ')}
              <br /> <b>Neighborhood:</b>
              {user.neighborhood}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={4}>
            <Grid.Column>
              <b>Role</b>
              <div>
                <FieldTag
                  className="role-tag"
                  content={user.role}
                  size="medium"
                />
              </div>
            </Grid.Column>
            <Grid.Column>
              <b>Teams</b>
              <div style={{ display: 'flex' }}>
                <TagList tags={user.teams} />
              </div>
            </Grid.Column>
            <Grid.Column>
              <b>Topic Interests</b>
              <div>
                <TagList tags={user.interests} />
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              {type === 'reject' && (
                <Message
                  size="small"
                  className="reject-message"
                  header="Rejection Reasoning"
                  warning
                  content={user.onboardReasoning}
                />
              )}
              <span style={{ color: 'gray' }}>
                {type === 'reject' ? 'Applied' : 'Registered'} on{' '}
                {new Date(user.dateJoined).toLocaleDateString()}
              </span>
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
                {user.journalismResponse}
              </div>

              {type === 'review' && (
                <>
                  <h5>
                    Reasoning <span style={{ color: 'gray' }}>- Optional</span>
                  </h5>
                  <Form.Input
                    value={onboardReasoning}
                    type="text"
                    onChange={(e, { value }) => setOnboardReasoning(value)}
                  />
                </>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {type === 'review' && (
          <Modal.Actions className="review-user-actions">
            <PrimaryButton
              className="approve-button"
              onClick={() => {
                updateUser({ onboardReasoning: onboardReasoning }, user._id);
                actionUpdate?.(user, 'ONBOARDED');
                setOpen(false);
              }}
              content="Approve"
            />
            <SecondaryButton
              className="decline-button"
              onClick={() => {
                updateUser({ onboardReasoning: onboardReasoning }, user._id);
                actionUpdate?.(user, 'DENIED');
                setOpen(false);
              }}
              content="Decline"
              border
            />
          </Modal.Actions>
        )}
      </Modal.Content>
    </Modal>
  );
};

export default ReviewUserModal;

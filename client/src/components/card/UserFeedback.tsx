import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Icon, Rating } from 'semantic-ui-react';
import { PopulatedUserFeedback } from 'ssw-common';

import './UserFeedback.scss';

interface UserFeedbackProps {
  feedback: PopulatedUserFeedback;
}

const UserFeedback: FC<UserFeedbackProps> = ({ feedback }) => (
  <Container className="feedback-container">
    <Grid>
      <Grid.Column width={4}>
        <div>
          <span className="staff-name">{feedback.staffId.fullname}</span>
          <span> left feedback: </span>
        </div>
        <p className="publish-date">
          {new Date(feedback.createdAt).toLocaleDateString()}
        </p>
      </Grid.Column>
      <Grid.Column width={10}>
        <div className="stars">
          <Rating
            className="rating"
            size="large"
            maxRating={5}
            disabled
            defaultRating={feedback.stars}
          />
        </div>

        <p className="reasoning">{feedback.reasoning}</p>
        <p className="relevant">RELEVANT PITCH</p>
        <p className="pitch">
          {feedback.pitchId !== null && feedback.pitchId.title}
          <Link className="open-link" to={`/pitch/${feedback.pitchId._id}`}>
            <Icon name="external alternate" />
          </Link>
        </p>
      </Grid.Column>
    </Grid>
  </Container>
);

export default UserFeedback;

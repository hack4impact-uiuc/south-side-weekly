import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, GridColumn, Icon, Rating } from 'semantic-ui-react';
import { IPitch, IUser, IUserFeedback } from 'ssw-common';

import { getAggregatedPitch, getUser, isError } from '../../api';
import { emptyUser } from '../../utils/constants';
import { formatDate, getUserFullName } from '../../utils/helpers';

import './styles.scss';

interface UserFeedbackProps {
  feedback: IUserFeedback;
}

const UserFeedback: FC<UserFeedbackProps> = ({ feedback }) => {
  const [staffUser, setStaffUser] = useState<IUser>();
  const [aggregate, setAggregate] = useState<IPitch>();

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      const res = await getUser(feedback.staffId);
      if (!isError(res)) {
        const user = res.data.result;
        setStaffUser(user);
      }
    };
    const getAggregate = async (): Promise<void> => {
      const res = await getAggregatedPitch(feedback.pitchId);

      if (!isError(res)) {
        const aggregatedPitch = res.data.result;
        setAggregate(aggregatedPitch);
      }
    };
    loadUser();
    getAggregate();
    return () => {
      setStaffUser(emptyUser);
    };
  }, [feedback.pitchId, feedback.staffId]);
  return (
    <Container className="feedback-container">
      <Grid>
        <GridColumn width={5}>
          <div>
            <span className="staff-name">{getUserFullName(staffUser)}</span>
            <span> left feedback: </span>
          </div>
          <p className="publish-date">
            {formatDate(new Date(feedback.createdAt))}
          </p>
        </GridColumn>
        <GridColumn width={10}>
          <Rating
            className="rating"
            size="large"
            maxRating={5}
            disabled
            defaultRating={feedback.stars}
          />
          <p className="reasoning">{feedback.reasoning}</p>
          <p className="relevant">RELEVANT PITCH</p>
          <p className="pitch">
            {aggregate?.title}
            <Link className="open-link" to={`/pitch/${feedback.pitchId}`}>
              <Icon name="external alternate" />
            </Link>
          </p>
        </GridColumn>
      </Grid>
    </Container>
  );
};

export default UserFeedback;

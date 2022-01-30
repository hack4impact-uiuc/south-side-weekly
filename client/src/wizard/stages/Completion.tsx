import React, { ReactElement, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Segment } from 'semantic-ui-react';

import { useAuth } from '../../contexts';

import './Completion.scss';

const Completion = (): ReactElement => {
  const { register } = useAuth();
  const history = useHistory();

  useEffect(() => {
    register();
  }, [register]);

  return (
    <div className="completition-wrapper">
      <Segment attached>
        Thank you for signing up and showing your interest in wanting to to
        contribute to South Side Weekly. We look forward to working with you! If
        you are a staff member, your request will be approved shortly by an
        admin. Until then, you will have contributor priviledges!
      </Segment>

      <Button
        attached="bottom"
        className="default-btn"
        fluid
        content="Go to Dashboard"
        onClick={() => history.push('/resources')}
      />
    </div>
  );
};

export default Completion;

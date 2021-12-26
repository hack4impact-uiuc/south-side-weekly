import React, { ReactElement, useEffect } from 'react';
import { Button, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';

import { useAuth } from '../../contexts';
import { openProfile } from '../../utils/helpers';

import './styles.scss';

const Completion = (): ReactElement => {
  const { register, user } = useAuth();

  useEffect(() => {
    Swal.fire({
      title: 'Account created!',
      icon: 'success',
    });

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
        onClick={() => openProfile(user!)}
      />
    </div>
  );
};

export default Completion;

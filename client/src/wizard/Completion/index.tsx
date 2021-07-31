import React, { ReactElement, useEffect } from 'react';
import Swal from 'sweetalert2';

import { Sidebar } from '../../components';
import { useAuth } from '../../contexts';

import './styles.scss';

const Completition = (): ReactElement => {
  const { register } = useAuth();

  useEffect(() => {
    Swal.fire({
      title: 'Account created!',
      icon: 'success',
    });

    register();
  }, [register]);

  return (
    <>
      <Sidebar currentPage="" />
      <div className="completition-wrapper">
        Thank you for signing up and showing your interest in wanting to become
        a Contributor for South Side Weekly. We look forward to working with
        you!
        <br />
        Redirecting you shortly...
      </div>
    </>
  );
};

export default Completition;

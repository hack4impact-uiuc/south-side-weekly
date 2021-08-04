import React, { ReactElement, useEffect } from 'react';
import Swal from 'sweetalert2';

import { Sidebar } from '../../components';
import { useAuth } from '../../contexts';

import './styles.scss';

const Completion = (): ReactElement => {
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
        Thank you for signing up and showing your interest in wanting to to
        contribute to South Side Weekly. We look forward to working with you! If
        you are a staff member, your request will be approved shortly by an
        admin. Until then, you will have contributor priviledges!
      </div>
    </>
  );
};

export default Completion;

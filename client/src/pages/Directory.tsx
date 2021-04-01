import React, { ReactElement } from 'react';

import Sidebar from '../components/Sidebar';
import Dropdown from '../components/Dropdown';
import SSW from '../assets/ssw-form-header.png';

const Directory = (): ReactElement => {
  const roleOptions = [
    { text: 'Contributor', color: '' },
    { text: 'Staff', color: '' },
    { text: 'Admin', color: '' },
  ];

  const dateOptions = [
    { text: 'Earliest to Latest', color: '' },
    { text: 'Latest to Earliest', color: '' },
  ];

  const interestOptions = [
    { text: 'Cannabis', color: '' },
    { text: 'Education', color: '' },
    { text: 'Food & Land', color: '' },
    { text: 'Fun', color: '' },
    { text: 'Health', color: '' },
    { text: 'Housing', color: '' },
    { text: 'Immigration', color: '' },
    { text: 'Lit', color: '' },
    { text: 'Music', color: '' },
    { text: 'Nature', color: '' },
    { text: 'Politics', color: '' },
    { text: 'Stage and Screen', color: '' },
    { text: 'Transportation', color: '' },
    { text: 'Visual Arts', color: '' },
  ];

  return (
    <div>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <img src={SSW} alt="South Side Weekly" style={{ width: '50%' }} />
      </div>
      <Sidebar />
      <div style={{ width: '90%', float: 'right' }}>
        <Dropdown text="Roles" options={roleOptions} />
        <Dropdown text="Dates" options={dateOptions} />
        <Dropdown text="Interest" options={interestOptions} />
      </div>
    </div>
  );
};

export default Directory;

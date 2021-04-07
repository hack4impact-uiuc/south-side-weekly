import React, { ReactElement } from 'react';
import { Search } from 'semantic-ui-react';

import TempProfile from '../assets/pfp.svg';
import Sidebar from '../components/Sidebar';
import Dropdown from '../components/Dropdown';
import SSW from '../assets/ssw-form-header.png';

import '../css/Directory.css';

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

  //   useEffect(() => {

  //   }, []);

  return (
    <>
      <Sidebar />
      <div className="directory-wrapper">
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img src={SSW} alt="South Side Weekly" style={{ width: '50%' }} />
        </div>
        <div className="directory-content">
          <h2>Directory</h2>
          <div className="directory-search">
            <Search fluid />
          </div>
          <div className="filters">
            <h2>Sort by: </h2>
            <Dropdown text="Roles" options={roleOptions} />
            <Dropdown
              text="Date Joined"
              options={dateOptions}
              defaultValue={dateOptions[0].text}
            />
            <Dropdown text="Interest" options={interestOptions} />
          </div>

          <div className="directory">
            <div className="result">
              <img src={TempProfile} alt="Profile" className="profile-picture" />
              <h2 className="text name">Name</h2>
              <h2 className="text">Role</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Directory;

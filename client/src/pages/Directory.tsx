import React, { ReactElement, useEffect, useState } from 'react';
import { Search } from 'semantic-ui-react';

import { getUsers, isError } from '../utils/apiWrapper';
import Sidebar from '../components/Sidebar';
import Dropdown from '../components/Dropdown';
import SSW from '../assets/ssw-form-header.png';

import '../css/Directory.css';

const Directory = (): ReactElement => {
  // TODO: Fix this state type
  const [directoryResults, setDirectoryResults] = useState<Array<any>>();

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

  useEffect(() => {
    const getDirectoryResults = async (): Promise<void> => {
      const resp = await getUsers();

      if (!isError(resp)) {
        setDirectoryResults(resp.data.result);
      }
    };

    getDirectoryResults();
  }, []);

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
            {directoryResults?.map((result) => (
              <div key={result._id} className="result">
                <img
                  src={result.profilePic}
                  alt="Profile"
                  className="profile-picture"
                />
                <h2 className="text name">{`${result.firstName} ${result.lastName}`}</h2>
                <h2 className="text">{result.role}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Directory;

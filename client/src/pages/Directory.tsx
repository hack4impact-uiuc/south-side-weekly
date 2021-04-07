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

  const roleOptions = ['Contributor', 'Staff', 'Admin'];

  const dateOptions = ['Earliest to Latest', 'Latest to Earliest'];

  const interestOptions = [
    'Cannabis',
    'Education',
    'Food & Land',
    'Fun',
    'Health',
    'Housing',
    'Immigration',
    'Lit',
    'Music',
    'Nature',
    'Politics',
    'Stage and Screen',
    'Transportation',
    'Visual Arts',
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

  // const filterUsersByKey = (): void => {
  //   console.log('test');
  // };

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
              defaultValue={dateOptions[0]}
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
                <h2 className="text">
                  {result.role.slice(0, 1) + result.role.slice(1).toLowerCase()}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Directory;

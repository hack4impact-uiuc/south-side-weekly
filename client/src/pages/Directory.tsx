import React, { ReactElement, useEffect, useState } from 'react';
import { Search, Dropdown } from 'semantic-ui-react';

import { IUser } from '../../../common/index';
import { getUsers, isError } from '../utils/apiWrapper';
import Sidebar from '../components/Sidebar';
import SSW from '../assets/ssw-form-header.png';

import '../css/Directory.css';

const Directory = (): ReactElement => {
  // TODO: Fix this state type
  const [directory, setDirectory] = useState<Array<IUser>>([]);
  const [displayDirectory, setDisplayDirectory] = useState<Array<IUser>>();

  const roleOptions = [
    { key: 1, text: 'Contributor', value: 'Contributor' },
    { key: 2, text: 'Staff', value: 'Staff' },
    { key: 3, text: 'Admin', value: 'Admin' },
  ];

  const dateOptions = [
    { key: 1, text: 'Earliest to Latest', value: 'Earliest to Latest' },
    { key: 2, text: 'Latest to Earliest', value: 'Latest to Earliest' },
  ];

  const interestOptions = [
    { key: 1, text: 'Cannabis', value: 'Cannabis' },
    { key: 2, text: 'Food & Land', value: 'Food & Land' },
    { key: 3, text: 'Fun', value: 'Fun' },
    { key: 4, text: 'Health', value: 'Health' },
    { key: 5, text: 'Housing', value: 'Housing' },
    { key: 6, text: 'Immigration', value: 'Immigration' },
    { key: 7, text: 'Lit', value: 'Lit' },
    { key: 8, text: 'Music', value: 'Music' },
    { key: 9, text: 'Nature', value: 'Nature' },
    { key: 10, text: 'Politics', value: 'Politics' },
    { key: 11, text: 'Stage and Screen', value: 'Stage and Screen' },
    { key: 12, text: 'Transportation', value: 'Transportation' },
    { key: 13, text: 'Visual Arts', value: 'Visual Arts' },
  ];

  /**
   * Populated the directory and connect to the API
   */
  useEffect(() => {
    const getDirectoryResults = async (): Promise<void> => {
      const resp = await getUsers();

      if (!isError(resp)) {
        console.log(resp);
        setDirectory(resp.data.result);
        setDisplayDirectory(resp.data.result);
      }
    };

    getDirectoryResults();
  }, []);

  /**
   * Sorts all of the users in the directory by date
   *
   * @param value the filter string representation, Earliest to Latest, Latest to Earliest, [empty]
   */
  const sortUsersByDate = (value: string): void => {
    if (value.length === 0) {
      setDisplayDirectory(directory);
      return;
    }

    const ascending = value === 'Earliest to Latest';

    const sortedDirectory: Array<IUser> = [...displayDirectory!];

    sortedDirectory.sort(function (first: IUser, second: IUser): number {
      const firstUserDate: Date = new Date(first.dateJoined);
      const secondUserDate: Date = new Date(second.dateJoined);

      if (firstUserDate > secondUserDate) {
        // -1 is a magic number
        return ascending ? 1 : 0 - 1;
      } else if (firstUserDate < secondUserDate) {
        return ascending ? 0 - 1 : 1;
      }
      return 0;
    });
    setDisplayDirectory([...sortedDirectory]);
  };

  /**
   * Filters out hte users that have the specified role
   *
   * @param role the role to filter by
   */
  const filterUsersByRole = (role: string): void => {
    if (role === '') {
      setDisplayDirectory(directory);
      return;
    }
    let filteredDirectory: Array<IUser> = [...displayDirectory!];

    filteredDirectory = filteredDirectory.filter(function (result: IUser) {
      return result.role === role.toUpperCase();
    });

    setDisplayDirectory([...filteredDirectory]);
  };

  /**
   * Filters out the users that have any of the selected interests
   *
   * @param interests the interests to filter by
   */
  const filterUsersByInterests = (
    interests: string | number | boolean | (string | number | boolean)[],
  ): void => {
    console.log(interests);
    if (typeof interests !== 'object') {
      console.error('Bad argument');
      return;
    } else if (interests.length === 0) {
      setDisplayDirectory(directory);
      return;
    }

    let filteredDirectory: Array<IUser> = [...directory!];

    filteredDirectory = filteredDirectory.filter(function (user: IUser) {
      let hasInterest = true;
      interests.forEach((interest) => {
        if (!user.interests.includes(interest.toString().toUpperCase())) {
          hasInterest = false;
        }
      });
      return hasInterest;
    });

    console.log(filteredDirectory);

    setDisplayDirectory([...filteredDirectory]);
  };

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
            <Dropdown
              className="custom-dropdown"
              text="Roles"
              options={roleOptions}
              scrolling
              clearable
              selectOnBlur={false}
              selectOnNavigation={false}
              onChange={(e, { value }) => filterUsersByRole(value!.toString())}
            />
            <Dropdown
              className="custom-dropdown"
              text="Date Joined"
              options={dateOptions}
              scrolling
              clearable
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={(e, { value }) => sortUsersByDate(`${value}`)}
            />
            <Dropdown
              className="custom-dropdown"
              text="Interests"
              options={interestOptions}
              scrolling
              multiple
              clearable
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={(e, { value }) => filterUsersByInterests(value!)}
            />
          </div>
          <div className="directory">
            {displayDirectory?.map((result) => (
              <div key={result.oauthID} className="result">
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

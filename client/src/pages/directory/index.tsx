import { startsWith, toLower, toString } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Input, Tab } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { isError } from '../../api';
import {
  getApprovedUsers,
  getDeniedUsers,
  getPendingUsers,
} from '../../api/user';
import {
  ApprovedUsers,
  InterestsSelect,
  PendingUsers,
  Select,
  TeamsSelect,
  Walkthrough,
} from '../../components';
import { allRoles } from '../../utils/constants';
import { pagesEnum } from '../../utils/enums';
import { parseOptionsSelect } from '../../utils/helpers';

import { filterInterests, filterRole, filterTeams } from './helpers';

import './styles.scss';

const searchFields: (keyof IUser)[] = [
  'firstName',
  'preferredName',
  'lastName',
  'email',
];

interface PaneWrapperProps {
  status: 'approved' | 'pending';
}

const PaneWrapper: FC<PaneWrapperProps> = ({ status }): ReactElement => {
  const [directory, setDirectory] = useState<IUser[]>([]);
  const [filteredDirectory, setFilteredDirectory] = useState<IUser[]>([]);
  const [role, setRole] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const getAllUsers = async (): Promise<void> => {
      let res;

      if (status === 'approved') {
        res = await getApprovedUsers();
      } else if (status === 'pending') {
        res = await getPendingUsers();
      } else {
        res = await getDeniedUsers();
      }
      //This gets all users regardless of their approval status
      if (!isError(res)) {
        setDirectory(res.data.result);
        setFilteredDirectory(res.data.result);
      }
    };

    getAllUsers();

    return () => {
      setDirectory([]);
      setFilteredDirectory([]);
    };
  }, [status]);

  useEffect(() => {
    const search = (users: IUser[]): IUser[] => {
      if (query.length === 0) {
        return users;
      }

      const searchTerm = toLower(query.trim());
      const queryParts = searchTerm.split(' ');

      return users.filter((user) =>
        queryParts.every((part) =>
          searchFields.some(
            (field) =>
              startsWith(toLower(toString(user[field])), part) ||
              startsWith(toLower(toString(user[field])), searchTerm),
          ),
        ),
      );
    };

    const filter = (users: IUser[]): IUser[] => {
      let filtered = filterInterests(users, interests);
      filtered = filterRole(filtered, role);
      filtered = filterTeams(filtered, teams);

      return filtered;
    };

    setFilteredDirectory([...search(filter(directory))]);
  }, [directory, query, interests, teams, role]);

  return (
    <>
      <Input
        value={query}
        onChange={(e, { value }) => setQuery(value)}
        fluid
        placeholder="Search..."
        icon="search"
        iconPosition="left"
      />
      {status === 'approved' ? (<div className="filters">
        <div>
          <h3>Filters: </h3>
        </div>
        <div className="wrapper">
          <Select
            value={role}
            options={parseOptionsSelect(allRoles)}
            onChange={(e) => setRole(e ? e.value : '')}
            placeholder="Role"
          />
        </div>
        <div className="wrapper">
          <InterestsSelect
            values={interests}
            onChange={(values) =>
              setInterests(values.map((item) => item.value))
            }
          />
        </div>
        <div className="wrapper">
          <TeamsSelect
            values={teams}
            onChange={(values) => setTeams(values.map((item) => item.value))}
          />
        </div>
      </div>) : ''}
      {status === 'approved' ? (
        <ApprovedUsers users={filteredDirectory} />
      ) : (
        <PendingUsers users={filteredDirectory} />
      )}
    </>
  );
};

const panes = [
  {
    menuItem: 'Approved Users',
    render: function show() {
      return (
        <Tab.Pane>
          <PaneWrapper status="approved" />
        </Tab.Pane>
      );
    },
  },
  {
    menuItem: 'Pending Users',
    render: function show() {
      return (
        <Tab.Pane>
          <PaneWrapper status="pending" />
        </Tab.Pane>
      );
    },
  },
];

const Directory = (): ReactElement => (
  <div className="directory-page">
    <Walkthrough
      page={pagesEnum.DIRECTORY}
      content="Check out the members on the SSW team and click their profiles to view more details!"
    />
    <Tab
      menu={{ secondary: true, pointing: true}}
      id="directory-tabs"
      panes={panes}
    />
  </div>
);

export default Directory;

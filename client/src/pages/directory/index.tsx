import React, { useEffect, useState, ReactElement } from 'react';
import { startsWith, toLower, toString } from 'lodash';
import { Input } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { getUsers, isError } from '../../api';
import { allRoles } from '../../utils/constants';
import { useTeams } from '../../contexts';
import {
  MultiSelect,
  Select,
  DirectoryTable,
  Walkthrough,
  InterestsSelect,
} from '../../components';
import { pagesEnum } from '../../utils/enums';

import { filterInterests, filterRole, filterTeams } from './helpers';

import './styles.scss';

const searchFields: (keyof IUser)[] = [
  'firstName',
  'preferredName',
  'lastName',
  'email',
];

const Directory = (): ReactElement => {
  const [directory, setDirectory] = useState<IUser[]>([]);
  const [filteredDirectory, setFilteredDirectory] = useState<IUser[]>([]);
  const [role, setRole] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');

  const { teams: allTeams } = useTeams();

  useEffect(() => {
    const getAllUsers = async (): Promise<void> => {
      const res = await getUsers();

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
  }, []);

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
    <div className="directory-page">
      <Walkthrough
        page={pagesEnum.DIRECTORY}
        content="Check out the members on the SSW team and click their profiles to view more details!"
      />
      <h2>Directory</h2>
      <Input
        value={query}
        onChange={(e, { value }) => setQuery(value)}
        fluid
        placeholder="Search..."
        icon="search"
        iconPosition="left"
      />
      <div className="filters">
        <div>
          <h3>Filters: </h3>
        </div>
        <div className="wrapper">
          <Select
            value={role}
            options={allRoles}
            onChange={(e) => setRole(e ? e.value : '')}
            placeholder="Role"
          />
        </div>
        <div className="wrapper">
          <InterestsSelect
            values={interests}
            onChange={(values) =>
              setInterests(values ? values.map((item) => item.value) : [])
            }
          />
        </div>
        <div className="wrapper">
          <MultiSelect
            value={teams}
            onChange={(values) =>
              setTeams(values ? values.map((item) => item.value) : [])
            }
            options={allTeams.map((team) => ({
              label: team.name,
              value: team._id,
            }))}
            placeholder="Teams"
          />
        </div>
      </div>
      <div className="directory">
        <DirectoryTable users={filteredDirectory} />
      </div>
    </div>
  );
};

export default Directory;

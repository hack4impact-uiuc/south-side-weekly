import React, { useEffect, useState, ReactElement } from 'react';
import { startsWith, toLower, toString } from 'lodash';
import { Input } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { getUsers, isError } from '../../api';
import { UserModal, MultiSelect, Select } from '../../components';
import { allInterests, allRoles, allTeams } from '../../utils/constants';

import { filterInterests, filterRole, filterTeams, sortUsers } from './helpers';
import './styles.scss';

const dateOptions = ['Earliest to Latest', 'Latest to Earliest'];

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
  const [sort, setSort] = useState<'increase' | 'decrease' | 'none'>('none');
  const [interests, setInterests] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');

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
      filtered = sortUsers(filtered, sort);

      return filtered;
    };

    setFilteredDirectory([...search(filter(directory))]);
  }, [directory, query, interests, teams, role, sort]);

  const getSortValue = (): string => {
    if (sort === 'increase') {
      return dateOptions[0];
    } else if (sort === 'decrease') {
      return dateOptions[1];
    }

    return '';
  };

  return (
    <div className="directory-page">
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
          <Select
            value={getSortValue()}
            options={dateOptions}
            onChange={(e) => {
              if (e) {
                if (e.value === dateOptions[0]) {
                  setSort('increase');
                } else {
                  setSort('decrease');
                }
              } else {
                setSort('none');
              }
            }}
            placeholder="Date Joined"
          />
        </div>
        <div className="wrapper">
          <MultiSelect
            value={interests}
            onChange={(values) =>
              setInterests(values ? values.map((item) => item.value) : [])
            }
            options={allInterests}
            placeholder="Interests"
          />
        </div>
        <div className="wrapper">
          <MultiSelect
            value={teams}
            onChange={(values) =>
              setTeams(values ? values.map((item) => item.value) : [])
            }
            options={allTeams}
            placeholder="Teams"
          />
        </div>
      </div>
      <div className="directory">
        {filteredDirectory.map((user, index) => (
          <UserModal user={user} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Directory;

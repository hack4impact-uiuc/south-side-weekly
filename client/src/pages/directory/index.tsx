import React, {
  useEffect,
  useState,
  ReactElement,
  SyntheticEvent,
} from 'react';
import { startsWith, toArray, toLower, toString } from 'lodash';
import { DropdownProps, Input } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { getUsers, isError } from '../../api';
import { UserModal, FilterDropdown, Walkthrough } from '../../components';
import { parseOptions } from '../../utils/helpers';
import { allInterests, allRoles, allTeams } from '../../utils/constants';
import { pagesEnum } from '../../utils/enums';

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

  const determineSort = (
    e: SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ): void => {
    if (typeof data.value === 'string') {
      if (data.value === dateOptions[0]) {
        setSort('increase');
      } else if (data.value === dateOptions[1]) {
        setSort('decrease');
      } else {
        setSort('none');
      }
    }
  };

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
          <FilterDropdown
            className="filter"
            text="Role"
            options={parseOptions(allRoles)}
            onChange={(e, { value }) => setRole(toString(value))}
          />
        </div>
        <div className="wrapper">
          <FilterDropdown
            className="filter"
            text="Date Joined"
            options={parseOptions(dateOptions)}
            onChange={determineSort}
          />
        </div>
        <div className="wrapper">
          <FilterDropdown
            className="filter"
            text="Topics of Interest"
            options={parseOptions(allInterests)}
            onChange={(e, { value }) => setInterests(toArray(value))}
            multiple
          />
        </div>
        <div className="wrapper">
          <FilterDropdown
            className="filter"
            text="Teams"
            options={parseOptions(allTeams)}
            onChange={(e, { value }) => setTeams(toArray(value))}
            multiple
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

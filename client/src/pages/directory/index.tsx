import React, {
  useEffect,
  useState,
  ReactElement,
  SyntheticEvent,
} from 'react';
import { startCase, startsWith, toArray, toLower, toString } from 'lodash';
import { Card, Dropdown, DropdownProps, Input, Image } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { getUsers, isError } from '../../api';
import { Header, Sidebar, UserModal } from '../../components';
import { getUserProfilePic, parseOptions } from '../../utils/helpers';
import {
  allInterests,
  allRoles,
  allTeams,
  emptyUser,
} from '../../utils/constants';
import { pages } from '../../utils/enums';

import { filterInterests, filterRole, filterTeams, sortUsers } from './helpers';
import './styles.scss';

const dateOptions = ['Earliest to Latest', 'Latest to Earliest'];

const searchFields: (keyof IUser)[] = [
  'firstName',
  'preferredName',
  'lastName',
  'email',
];

interface ModalInfo {
  isOpen: boolean;
  user: IUser;
}

const Directory = (): ReactElement => {
  const [directory, setDirectory] = useState<IUser[]>([]);
  const [filteredDirectory, setFilteredDirectory] = useState<IUser[]>([]);
  const [role, setRole] = useState<string>('');
  const [sort, setSort] = useState<'increase' | 'decrease' | 'none'>('none');
  const [interests, setInterests] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');
  const [modal, setModal] = useState<ModalInfo>({
    isOpen: false,
    user: emptyUser,
  });

  useEffect(() => {
    const getAllUsers = async (): Promise<void> => {
      const res = await getUsers();

      if (!isError(res)) {
        setDirectory(res.data.result);
        setFilteredDirectory(res.data.result);
      }
    };

    getAllUsers();
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

    setFilteredDirectory(search(filter(directory)));
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

  const openModal = (user: IUser): void => {
    setModal({
      isOpen: true,
      user: user,
    });
  };

  const closeModal = (): void => {
    setModal({
      isOpen: false,
      user: emptyUser,
    });
  };

  return (
    <>
      <UserModal onClose={closeModal} open={modal.isOpen} user={modal.user} />
      <Sidebar currentPage={pages.USERS} />
      <Header />
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
            <Dropdown
              className="filter"
              text="Roles"
              scrolling
              clearable
              options={parseOptions(allRoles)}
              selectOnBlur={false}
              selectOnNavigation={false}
              onChange={(e, { value }) => setRole(toString(value))}
              fluid
            />
          </div>
          <div className="wrapper">
            <Dropdown
              className="filter"
              text="Date Joined"
              scrolling
              clearable
              options={parseOptions(dateOptions)}
              selectOnBlur={false}
              selectOnNavigation={false}
              onChange={determineSort}
              fluid
            />
          </div>
          <div className="wrapper">
            <Dropdown
              className="filter"
              text="Topics of Interest"
              options={parseOptions(allInterests)}
              scrolling
              multiple
              clearable
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={(e, { value }) => setInterests(toArray(value))}
              fluid
            />
          </div>
          <div className="wrapper">
            <Dropdown
              className="filter"
              text="Teams"
              options={parseOptions(allTeams)}
              scrolling
              multiple
              clearable
              selectOnNavigation={false}
              selectOnBlur={false}
              onChange={(e, { value }) => setTeams(toArray(value))}
              fluid
            />
          </div>
        </div>
        <div className="directory">
          {filteredDirectory.map((user, index) => (
            <Card onClick={() => openModal(user)} fluid key={index}>
              <Card.Content>
                <Image
                  circular
                  size="mini"
                  src={getUserProfilePic(user)}
                  alt={user.firstName}
                />
                <div className="name">
                  <h2>{`${user.firstName} ${user.lastName}`}</h2>
                </div>
                <div>
                  <h2>{startCase(toLower(user.role))}</h2>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Directory;

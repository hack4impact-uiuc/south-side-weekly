import { startsWith, toLower, toString } from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
import { Icon, Input, Tab } from 'semantic-ui-react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import { IUser } from 'ssw-common';
import { getUsers, isError } from '../../api';
import {
  EditInterests,
  FieldTag,
  InterestsSelect,
  OnboardingTable,
  Select,
  TeamsSelect,
  Walkthrough,
} from '../../components';
import DynamicTable from '../../components/Tables/DyanmicTable';
import { useInterests } from '../../contexts';
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

const ApprovedUsers = (): ReactElement => {
  const [directory, setDirectory] = useState<IUser[]>([]);
  const [filteredDirectory, setFilteredDirectory] = useState<IUser[]>([]);
  const [role, setRole] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');
  const { getInterestById } = useInterests();

  // const resetFilters = () => {
  //   setRole('');
  //   setInterests([]);
  //   setTeams([]);
  //   setQuery('');
  // };

  useEffect(() => {
    const getAllUsers = async (): Promise<void> => {
      const res = await getUsers();
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
      </div>
      <div className="directory">
        <DynamicTable<IUser>
          records={filteredDirectory}
          columns={[
            {
              title: 'First name',
              extractor: 'firstName',
              sorter: (a, b) => a.firstName.localeCompare(b.firstName),
            },
            {
              title: 'Last name',
              extractor: 'lastName',
              sorter: (a, b) => a.firstName.localeCompare(b.firstName),
            },
            {
              title: 'Email',
              extractor: function EmailCell({ email }) {
                return (
                  <>
                    <Icon name="mail" />
                    {email}
                  </>
                );
              },
            },
            {
              title: 'Topics',
              headerModal: EditInterests,
              extractor: function TopicsCell({ interests }) {
                return interests.map((interest, i) => (
                  <FieldTag
                    name={getInterestById(interest)?.name}
                    hexcode={getInterestById(interest)?.color as SemanticCOLORS}
                    key={i}
                  />
                ));
              },
            },
          ]}
          singleLine
        />
      </div>
    </div>
  );
};

const PendingUsers = (): ReactElement => {
  const [directory, setDirectory] = useState<IUser[]>([]);
  const [filteredDirectory, setFilteredDirectory] = useState<IUser[]>([]);

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

    setFilteredDirectory([...search(directory)]);
  }, [directory, query]);

  return (
    <div className="directory-page">
      <Input
        value={query}
        onChange={(e, { value }) => setQuery(value)}
        fluid
        placeholder="Search..."
        icon="search"
        iconPosition="left"
      />
      {/* <div className="filters">
        <div>
          <h3>Filters: </h3>
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
      </div> */}
      <div className="directory">
        <OnboardingTable users={filteredDirectory} />
      </div>
    </div>
  );
};

const panes = [
  {
    menuItem: 'Approved Users',
    // eslint-disable-next-line react/display-name
    render: () => (
      <Tab.Pane>
        <ApprovedUsers />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Pending Users',
    pane: <PendingUsers />,
  },
];

const Directory = (): ReactElement => (
  <>
    <Walkthrough
      page={pagesEnum.DIRECTORY}
      content="Check out the members on the SSW team and click their profiles to view more details!"
    />
    <h2>Directory</h2>
    <Tab panes={panes} />
  </>
);

export default Directory;

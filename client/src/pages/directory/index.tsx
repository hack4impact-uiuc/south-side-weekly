import { startsWith, toLower, toString } from 'lodash';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Input, Tab } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { isError } from '../../api';
import {
  getApprovedUsers,
  getDeniedUsers,
  getPendingUsers,
} from '../../api/user';
import {
  AdminView,
  ContributorView,
  ApprovedUsers,
  InterestsSelect,
  PendingUsers,
  Select,
  TeamsSelect,
  Walkthrough,
} from '../../components';
import { PaginationQueryArgs } from '../../components/Tables/PaginatedTable/types';
import { allRoles } from '../../utils/constants';
import { pagesEnum } from '../../utils/enums';
import { parseOptionsSelect } from '../../utils/helpers';

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
  const [role, setRole] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(10);

  const getParams = useCallback(
    (): Record<string, string[]> => ({
      interests,
      teams,
      role: role === '' ? [] : [role],
    }),
    [query, interests, teams, role, page, pageLimit],
  );

  const queryFunction = useCallback(
    (params: PaginationQueryArgs) => {
      const fetchResource = () => {
        let query;

        if (status === 'approved') {
          query = getApprovedUsers;
        } else if (status === 'pending') {
          query = getPendingUsers;
        } else {
          query = getDeniedUsers;
        }

        return query({ ...params, ...getParams() });
      };

      return fetchResource();
    },
    [status, getParams],
  );

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
      {status === 'approved' && (
        <div className="params">
          <div>
            <h3>params: </h3>
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
      )}
      {status === 'approved' ? (
        <ApprovedUsers query={queryFunction} />
      ) : (
        <PendingUsers query={queryFunction} />
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
    <AdminView>
      <Tab
        menu={{ secondary: true, pointing: true }}
        id="directory-tabs"
        panes={panes}
      />
    </AdminView>
    <ContributorView>
      <PaneWrapper status="approved" />
    </ContributorView>
  </div>
);

export default Directory;

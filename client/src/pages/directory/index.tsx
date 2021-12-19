import { debounce } from 'lodash';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Input, InputOnChangeData, Tab } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { Response, PaginationResponseBase } from '../../api/types';
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
  DeniedUsers,
  Select,
  TeamsSelect,
  Walkthrough,
} from '../../components';
import { PaginationQueryArgs } from '../../components/Tables/PaginatedTable/types';
import { allRoles, allActivities } from '../../utils/constants';
import { pagesEnum } from '../../utils/enums';
import { parseOptionsSelect } from '../../utils/helpers';

import './styles.scss';

interface PaneWrapperProps {
  status: 'approved' | 'pending' | 'denied';
}

const searchDebounceTime = 250;

const PaneWrapper: FC<PaneWrapperProps> = ({ status }): ReactElement => {
  const [role, setRole] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activity, setActivity] = useState<string>('');
  const [filterParams, setFilterParams] = useState<Record<string, string[]>>(
    {},
  );

  const setSearchQueryDebounced = useMemo(
    () => debounce(setSearchQuery, searchDebounceTime),
    [setSearchQuery],
  );

  useEffect(() => {
    setFilterParams({
      interests,
      teams,
      role: role === '' ? [] : [role],
      activity: activity === '' ? [] : [activity],
      search: searchQuery === '' ? [] : [searchQuery],
    });
  }, [searchQuery, interests, teams, role, activity]);

  const queryFunction = useCallback(
    (
      params: PaginationQueryArgs,
    ): Promise<Response<PaginationResponseBase<IUser[]>>> => {
      const fetchResource = (): Promise<
        Response<PaginationResponseBase<IUser[]>>
      > => {
        let query;

        if (status === 'approved') {
          query = getApprovedUsers;
        } else if (status === 'pending') {
          query = getPendingUsers;
        } else {
          query = getDeniedUsers;
        }

        return query({ ...params, ...filterParams }) as Promise<
          Response<PaginationResponseBase<IUser[]>>
        >;
      };
      return fetchResource();
    },
    [status, filterParams],
  );

  const handleSearch = (
    _: React.ChangeEvent<HTMLInputElement>,
    { value }: InputOnChangeData,
  ): void => {
    setSearch(value);
    setSearchQueryDebounced.cancel();
    setSearchQueryDebounced(value);
  };

  return (
    <>
      {status === 'approved' && (
        <>
          <div className="top-filters">
            <div className="wrapper input">
              <Input
                value={search}
                onChange={handleSearch}
                fluid
                placeholder="Search by name or email..."
                icon="search"
                iconPosition="left"
              />
            </div>
            <div className="wrapper">
              <Select
                value={activity}
                options={parseOptionsSelect(allActivities)}
                onChange={(e) => setActivity(e ? e.value : '')}
                placeholder="Activity"
              />
            </div>
          </div>
          <div className="bottom-filters">
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
                onChange={(values) =>
                  setTeams(values.map((item) => item.value))
                }
              />
            </div>
          </div>
        </>
      )}
      {status === 'approved' && (
        <ApprovedUsers query={queryFunction} filterParams={filterParams} />
      )}
      {status === 'pending' && (
        <PendingUsers query={queryFunction} filterParams={filterParams} />
      )}
      {status === 'denied' && (
        <DeniedUsers query={queryFunction} filterParams={filterParams} />
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
  {
    menuItem: 'Rejected Users',
    render: function show() {
      return (
        <Tab.Pane>
          <PaneWrapper status="denied" />
        </Tab.Pane>
      );
    },
  },
];

const Directory = (): ReactElement => (
  <div className="directory-page">
    <div className="page-header-content directory-page-header">
      <Walkthrough
        page={pagesEnum.DIRECTORY}
        content="Check out the members on the SSW team and click their profiles to view more details!"
      />
    </div>
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

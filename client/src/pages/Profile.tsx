import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import {
  BasePopulatedPitch,
  BasePopulatedUser,
  PopulatedUserFeedback,
  Team,
  User,
} from 'ssw-common';
import { Grid, Pagination, Rating, SemanticWIDTHS } from 'semantic-ui-react';
import _ from 'lodash';
import { StringParam, useQueryParams } from 'use-query-params';

import { loadFullUser, loadUserPermissions } from '../api/apiWrapper';
import { FieldTag, UserPicture } from '../components';
import { configureColumn } from '../components/table/dynamic/DynamicTable2.0';
import UserFeedback from '../components/card/UserFeedback';
import { EditUserModal } from '../components/modal/EditUser';
import { useAuth } from '../contexts';
import { TagList } from '../components/list/TagList';
import { IconLabel } from '../components/ui/IconLabel';
import { PaginatedTable } from '../components/table/dynamic/PaginatedTable';
import { apiCall, isError } from '../api';
import { SingleSelect } from '../components/select/SingleSelect';
import { parseOptionsSelect } from '../utils/helpers';
import Loading from '../components/ui/Loading';
import { pitchStatusEnum } from '../utils/enums';
import { pitchStatusCol } from '../components/table/columns';

import './Profile.scss';

interface PitchesRes {
  data: BasePopulatedPitch[];
  count: number;
}

interface FeedbackRes {
  data: PopulatedUserFeedback[];
  count: number;
}

const Profile = (): ReactElement => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, isAdmin, isStaff } = useAuth();
  const [queries, setQueries] = useQueryParams({
    limit: StringParam,
    offset: StringParam,
    f_limit: StringParam,
    f_offset: StringParam,
  });
  const [user, setUser] = useState<BasePopulatedUser>();
  const [pitchesData, setPitchesData] = useState<PitchesRes>();
  const [feedbackData, setFeedbackData] = useState<FeedbackRes>();

  const location = useLocation();
  const history = useHistory();
  const [permissions, setPermissions] = useState<{
    view: (keyof User)[];
    edit: (keyof User)[];
  }>({ view: [], edit: [] });

  const updateQuery = (key: string, v: string | undefined): void => {
    if (v === undefined || v === '') {
      setQueries({ [key]: undefined });
      return;
    }
    setQueries({ [key]: v });
  };

  const parseActivePage = (page: string | number | undefined): number => {
    if (page === undefined) {
      return 0;
    }

    return parseInt(String(page), 10) - 1;
  };

  const rating = useMemo((): number => {
    if (!feedbackData) {
      return 0;
    }

    if (feedbackData.count === 0) {
      return 0;
    }

    const sum = feedbackData.data.reduce((acc, curr) => acc + curr.stars, 0);
    return Math.round(sum / feedbackData.data.length);
  }, [feedbackData]);

  const queryParams = useMemo(() => {
    if (!user) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const q = {
      limit: params.get('limit') || '10',
      offset: params.get('offset') || '0',
      sortBy: params.get('sortBy'),
      orderBy: params.get('orderBy'),
    };

    return _.omitBy(q, _.isNil);
  }, [location.search, user]);

  const feedbackQueryParams = useMemo(() => {
    if (!user) {
      return;
    }
    const params = new URLSearchParams(location.search);
    const q = {
      limit: params.get('f_limit') || '10',
      offset: params.get('f_offset') || '0',
    };

    return _.omitBy(q, _.isNil);
  }, [location.search, user]);

  const loadUser = useCallback(async (): Promise<void> => {
    const user = await loadFullUser(userId);

    if (!user) {
      return;
    }

    const [permissions] = await Promise.all([loadUserPermissions(userId)]);

    setPermissions(permissions);
    setUser(user);
  }, [userId]);

  useEffect(() => {
    loadUser();
  }, [userId, loadUser]);

  useEffect(() => {
    const loadPitches = async (): Promise<void> => {
      const res = await apiCall<PitchesRes>({
        url: `/users/${user?._id}/pitches`,
        method: 'GET',
        populate: 'default',
        query: queryParams,
      });

      if (!isError(res)) {
        setPitchesData(res.data.result);
      }
    };

    if (!user) {
      return;
    }

    loadPitches();
  }, [queryParams, user]);

  useEffect(() => {
    const loadFeedback = async (): Promise<void> => {
      const res = await apiCall<{
        data: PopulatedUserFeedback[];
        count: number;
      }>({
        url: `/userFeedback/user/${user?._id}`,
        method: 'GET',
        query: feedbackQueryParams,
        populate: 'default',
      });

      if (!isError(res)) {
        setFeedbackData(res.data.result);
      }
    };

    if (!user) {
      return;
    }

    loadFeedback();
  }, [feedbackQueryParams, user]);

  useEffect(() => {
    setPitchesData({ data: [], count: 0 });
    setFeedbackData({ data: [], count: 0 });
    setQueries({ limit: '10', offset: '0', f_limit: '10', f_offset: '0' });
  }, [setQueries]);

  if (!user || !feedbackData || !pitchesData) {
    return <Loading open />;
  }

  const titleColumn = configureColumn<BasePopulatedPitch>({
    id: 'title',
    title: 'Title',
    width: 5,
    extractor: (pitch) => pitch.title,
    sortable: true,
    sorter: (a, b) => a.title.localeCompare(b.title),
  });
  const topicsColumn = configureColumn<BasePopulatedPitch>({
    title: 'Associated Topics',
    width: 5,
    extractor: function getTopics(pitch) {
      return <TagList limit={3} tags={pitch.topics} />;
    },
  });

  const getTeamsForPitch = (pitch: BasePopulatedPitch): Team[] => {
    const teams: Team[] = [];
    pitch.assignmentContributors.map((contributor) => {
      if (contributor.userId._id === userId) {
        contributor.teams.map((t) => teams.push(t));
      }
    });
    if (pitch.writer?._id === userId) {
      const writingTeam = currentUser?.teams.find(
        ({ name }) => name === 'Writing',
      );
      if (writingTeam) {
        teams.push(writingTeam);
      }
    }
    if (
      pitch.secondEditors.find(({ _id }) => _id === userId) ||
      pitch.thirdEditors.find(({ _id }) => _id === userId) ||
      pitch.primaryEditor?._id === userId
    ) {
      const editingTeam = currentUser?.teams.find(
        ({ name }) => name === 'Editing',
      );
      if (editingTeam) {
        teams.push(editingTeam);
      }
    }
    return teams;
  };

  const teamsColumn = configureColumn<BasePopulatedPitch>({
    title: "Team(s) You're On",
    width: 3,
    extractor: function getTeams(pitch) {
      return <TagList tags={getTeamsForPitch(pitch)} />;
    },
  });

  const publishDateColumn = configureColumn<BasePopulatedPitch>({
    title: 'Publish Date',
    width: 5,
    extractor: (pitch) =>
      pitch.issueStatuses && pitch.issueStatuses.length > 0
        ? new Date(
            pitch.issueStatuses[0].issueId.releaseDate,
          ).toLocaleDateString()
        : 'Not Published',
    sortable: true,
  });

  const pitchStatusColWidth = 2 as SemanticWIDTHS;
  const cols = [
    titleColumn,
    { ...pitchStatusCol, width: pitchStatusColWidth },
    topicsColumn,
    teamsColumn,
    publishDateColumn,
  ];

  return (
    <div className="profile-page">
      <div className="page-header-content">
        <Grid className="profile-header" padded stackable>
          <Grid.Row columns={5}>
            <Grid.Column
              className="profile-pic-col"
              text-align="left"
              width={5}
            >
              <div className="user-pic">
                <UserPicture size="tiny" user={user} />
              </div>
              <div className="name-pronouns">
                {user.joinedNames}
                <div>
                  {user.pronouns.map((pronoun, index) => (
                    <FieldTag
                      key={index}
                      name={pronoun.toLowerCase()}
                      content="pronouns"
                      size="small"
                    />
                  ))}
                </div>
                <div className="user-role">
                  <FieldTag size="small" content={user.role} />
                </div>
                {feedbackData.count > 0 ? (
                  <div className="rating">
                    <Rating
                      defaultRating={rating}
                      maxRating={5}
                      disabled
                      className="rating-icon"
                    />
                    <p className="number-ratings">({feedbackData.count})</p>
                  </div>
                ) : (
                  <p className="no-ratings"> No ratings </p>
                )}

                <div>
                  {(userId === currentUser!._id || isAdmin) && (
                    <EditUserModal
                      onUnmount={loadUser}
                      user={user}
                      permissions={permissions}
                    />
                  )}
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="social-inputs">
                <IconLabel
                  icon="mail"
                  value={user.email}
                  viewable={permissions.view.includes('email')}
                />
                <IconLabel
                  icon="phone"
                  value={user.phone}
                  viewable={permissions.view.includes('phone')}
                />
                <IconLabel icon="linkedin" value={user.linkedIn} viewable />
                <IconLabel icon="globe" value={user.portfolio} viewable />
                <IconLabel icon="twitter" value={user.twitter} viewable />
                <p className="registration">
                  Registered on {new Date(user.dateJoined).toLocaleDateString()}
                  .
                </p>
              </div>
            </Grid.Column>

            <Grid.Column textAlign="left" width={2}>
              <div>
                <h4>Teams</h4>
              </div>
              <div className="tag-col">
                <TagList
                  size="medium"
                  className="tag-spacing"
                  tags={user.teams}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="left" width={2}>
              <div>
                <h4>Topic Interests</h4>
              </div>
              <div className="tag-col">
                <TagList
                  size="medium"
                  className="tag-spacing"
                  tags={user.interests}
                />
              </div>
            </Grid.Column>

            <Grid.Column width={2}>
              <h4>Neighborhood</h4>
              <p>{user.neighborhood}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <div className="page-inner-content">
        {userId === currentUser!._id ? (
          <h2>Your Contributions</h2>
        ) : (
          <h2>{`${user.firstName}'s` + ` Contributions`}</h2>
        )}

        <PaginatedTable
          columns={cols}
          records={pitchesData.data}
          count={pitchesData.count}
          pageOptions={['1', '10', '25', '50']}
          onRecordClick={(pitch) => history.push(`/pitch/${pitch._id}`)}
          sortable
          sortType="query"
        />

        <Grid columns={2} className="experience">
          <Grid.Column>
            <h4>How and why user wants to get involved</h4>
            <p>{user.involvementResponse}</p>
          </Grid.Column>

          <Grid.Column>
            <h4>User's past experience</h4>
            <p>{user.journalismResponse}</p>
          </Grid.Column>
        </Grid>
        {(userId === currentUser?._id || isStaff || isAdmin) && (
          <Grid centered className="feedback">
            <Grid.Column width={10}>
              <h2 className="title">{`${user.firstName}'s`} Feedback</h2>

              {feedbackData.count > 0 ? (
                <div
                  style={{
                    // display: 'flex',
                    marginTop: '20px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span>Records per page: </span>
                    <SingleSelect
                      value={queries.f_limit || '10'}
                      options={parseOptionsSelect(['1', '10', '25', '50'])}
                      onChange={(v) =>
                        updateQuery('f_limit', v ? v?.value : '10')
                      }
                      placeholder="Limit"
                    />
                    <br />
                    <div>
                      <p>Total count: {feedbackData.count}</p>
                    </div>
                  </div>
                  <div className="feedback-cards">
                    {feedbackData.data.map((feedback, index) => (
                      <div key={index} className="user-feedback">
                        <UserFeedback feedback={feedback} />
                      </div>
                    ))}
                  </div>
                  <Pagination
                    totalPages={Math.ceil(
                      feedbackData.count /
                        parseInt(queries.f_limit || '10', 10),
                    )}
                    onPageChange={(e, { activePage }) =>
                      updateQuery(
                        'f_offset',
                        String(parseActivePage(activePage)),
                      )
                    }
                  />
                </div>
              ) : (
                <div>No feedback</div>
              )}
            </Grid.Column>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default Profile;

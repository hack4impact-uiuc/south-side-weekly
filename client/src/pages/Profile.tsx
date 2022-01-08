import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  BasePopulatedPitch,
  BasePopulatedUser,
  PopulatedUserFeedback,
  Team,
  User,
} from 'ssw-common';
import { Grid, Rating } from 'semantic-ui-react';
import _ from 'lodash';
import { useQueryParams } from 'use-query-params';

import {
  loadFullFeedback,
  loadFullUser,
  loadUserPermissions,
} from '../api/apiWrapper';
import { buildColumn, FieldTag, UserPicture } from '../components';
import UserFeedback from '../components/card/UserFeedback';
import { EditUserModal } from '../components/modal/EditUser';
import { useAuth } from '../contexts';
import { TagList } from '../components/list/TagList';
import { IconLabel } from '../components/ui/IconLabel';
import './Profile.scss';
import { PaginatedTable } from '../components/table/dynamic/PaginatedTable';
import { apiCall, isError } from '../api';

interface PitchesRes {
  data: BasePopulatedPitch[];
  count: number;
}

const Profile = (): ReactElement => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, isAdmin } = useAuth();
  const [, setQuery] = useQueryParams({});
  const [user, setUser] = useState<BasePopulatedUser>();
  const [feedback, setFeedback] = useState<PopulatedUserFeedback[]>([]);
  const [data, setData] = useState<PitchesRes>({ data: [], count: 0 });

  const location = useLocation();
  const [permissions, setPermissions] = useState<{
    view: (keyof User)[];
    edit: (keyof User)[];
  }>({ view: [], edit: [] });

  const rating = useMemo((): number => {
    if (feedback.length === 0) {
      return 0;
    }

    const sum = feedback.reduce((acc, curr) => acc + curr.stars, 0);
    return sum / feedback.length;
  }, [feedback]);

  const queryParams = useMemo(() => {
    if (!user) {
      return;
    }
    const params = new URLSearchParams(location.search);
    const ids = [...user.claimedPitches, ...user.submittedPitches];
    const q = {
      limit: params.get('limit'),
      offset: params.get('offset'),
      _id__in: ids.join(','),
    };

    return _.omitBy(q, _.isNil);
  }, [location.search, user]);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const user = await loadFullUser(userId);

      if (!user) {
        return;
      }

      const [feedback, permissions] = await Promise.all([
        loadFullFeedback(user.feedback),
        loadUserPermissions(userId),
      ]);

      setPermissions(permissions);
      setFeedback(feedback);
      setUser(user);
    };
    loadData();
  }, [userId]);

  useEffect(() => {
    const loadPitches = async (): Promise<void> => {
      const res = await apiCall<PitchesRes>({
        url: `/pitches`,
        method: 'GET',
        populate: 'default',
        query: queryParams,
      });

      if (!isError(res)) {
        setData(res.data.result);
      }
    };
    loadPitches();
  }, [queryParams]);

  useEffect(() => {
    setData({ data: [], count: 0 });
    setQuery({ limit: 10, offset: 0 }, 'push');
  }, [setQuery]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const titleColumn = buildColumn<BasePopulatedPitch>({
    title: 'Title',
    width: 5,
    extractor: (pitch) => pitch.title,
    sorter: (a, b) => a.title.localeCompare(b.title),
  });
  const topicsColumn = buildColumn<BasePopulatedPitch>({
    title: 'Associated Topics',
    width: 5,
    extractor: function getTopics(pitch) {
      return <TagList tags={pitch.topics} />;
    },
  });

  const getTeamsForPitch = (pitch: BasePopulatedPitch): Team[] => {
    const contributor = pitch.assignmentContributors.find(
      (contributor) => contributor.userId._id === userId,
    );

    if (!contributor) {
      return [];
    }

    return contributor.teams;
  };

  const teamsColumn = buildColumn<BasePopulatedPitch>({
    title: "Team(s) You're On",
    width: 5,
    extractor: function getTeams(pitch) {
      return <TagList tags={getTeamsForPitch(pitch)} />;
    },
  });

  const publishDateColumn = buildColumn<BasePopulatedPitch>({
    title: 'Publish Date',
    width: 5,
    extractor: (pitch) =>
      pitch.issueStatuses && pitch.issueStatuses.length > 0
        ? new Date(
            pitch.issueStatuses[0].issueId.releaseDate,
          ).toLocaleDateString()
        : 'Not Published',
    sorter: (a, b) => {
      if (a.issueStatuses.length === 0) {
        return 1;
      }

      if (b.issueStatuses.length === 0) {
        return 0 - 1;
      }

      return a.issueStatuses[0].issueId.releaseDate.localeCompare(
        b.issueStatuses[0].issueId.releaseDate,
      );
    },
  });

  const cols = [titleColumn, topicsColumn, teamsColumn, publishDateColumn];

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
                {feedback.length > 0 ? (
                  <div className="rating">
                    <Rating
                      defaultRating={rating}
                      maxRating={5}
                      disabled
                      className="rating-icon"
                    />
                    <p className="number-ratings">({feedback.length})</p>
                  </div>
                ) : (
                  <p className="no-ratings"> No ratings </p>
                )}

                <div>
                  {(userId === currentUser!._id || isAdmin) && (
                    <EditUserModal user={user} permissions={permissions} />
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
              <h4>Teams</h4>
              <TagList
                size="medium"
                className="tag-spacing"
                tags={user.teams}
              />
            </Grid.Column>

            <Grid.Column textAlign="left" width={2}>
              <div>
                <h4>Topic Interests</h4>
              </div>
              <TagList
                size="medium"
                className="tag-spacing"
                tags={user.interests}
              />
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
          records={data.data}
          count={data.count}
          pageOptions={['1', '10', '25', '50']}
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
        {feedback.length > 0 && (
          <Grid centered className="feedback">
            <Grid.Column width={10}>
              <h2 className="title">{`${user.firstName}'s`} Feedback</h2>

              {feedback.map((feedback, index) => (
                <div key={index} className="user-feedback">
                  <UserFeedback feedback={feedback} />
                </div>
              ))}
            </Grid.Column>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default Profile;

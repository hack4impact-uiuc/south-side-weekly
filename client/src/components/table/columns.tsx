import React from 'react';
import { Icon } from 'semantic-ui-react';
import {
  BasePopulatedPitch,
  BasePopulatedUser,
  FullPopulatedPitch,
  Pitch,
} from 'ssw-common';

import { buildColumn, FieldTag, UserPicture } from '..';
import { approveUser, rejectUser } from '../../api/apiWrapper';
import { useAuth, useTeams } from '../../contexts';
import {
  findPendingContributor,
  getPitchTeamsForContributor,
  getUserClaimStatusForPitch,
} from '../../utils/helpers';
import {
  ClaimableTeamsList,
  ClaimableTeamsPitch,
  getClaimableTeams,
} from '../list/ClaimableTeamsList';
import { TagList } from '../list/TagList';
import UserChip from '../tag/UserChip';
import { LinkDisplay } from '../ui/LinkDisplayButton';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';

import { configureColumn } from './dynamic/DynamicTable2.0';

export const profilePic = configureColumn<BasePopulatedUser>({
  id: 'profilePic',
  title: '',
  width: 1,
  extractor: function Pic(user: BasePopulatedUser) {
    return (
      <UserPicture style={{ width: '25px', margin: 'auto' }} user={user} />
    );
  },
});

export const nameColumn = configureColumn<BasePopulatedUser>({
  id: 'firstName',
  title: 'Name',
  width: 3,
  extractor: function getName(user: BasePopulatedUser) {
    return `${user.joinedNames} (${user.pronouns.join('/')})`;
  },
  sortable: true,
});

export const roleColumn = configureColumn<BasePopulatedUser>({
  id: 'role',
  title: 'Role',
  width: 2,
  extractor: function getRoles(user: BasePopulatedUser) {
    return <FieldTag size="tiny" content={user.role} />;
  },
  sortable: true,
});

export const teamsColumn = configureColumn<BasePopulatedUser>({
  id: 'teams',
  title: 'Teams',
  width: 2,
  extractor: function getTeams(user: BasePopulatedUser) {
    return <TagList size="tiny" tags={user.teams} />;
  },
});

export const interestsColumn = configureColumn<BasePopulatedUser>({
  id: 'interests',
  title: 'Interests',
  extractor: function getInterests(user: BasePopulatedUser) {
    return (
      <>
        <TagList size="tiny" tags={user.interests} limit={3} />
      </>
    );
  },
});

export const statusColumn = configureColumn<BasePopulatedUser>({
  id: 'activityStatus',
  title: 'Status',
  width: 1,
  extractor: function getStatus(user: BasePopulatedUser) {
    return <FieldTag size="tiny" content={user.activityStatus} />;
  },
});

export const ratingColumn = configureColumn<BasePopulatedUser>({
  id: 'rating',
  title: 'Rating',
  width: 2,
  extractor: function getRating(user: BasePopulatedUser) {
    return `${user.rating ? user.rating.toFixed(2) : '-'} / 5`;
  },
  sortable: true,
});

export const joinedColumn = configureColumn<BasePopulatedUser>({
  id: 'dateJoined',
  title: 'Joined',
  width: 2,
  extractor: function getJoined(user: BasePopulatedUser) {
    return new Date(user.dateJoined).toLocaleDateString();
  },
  sortable: true,
});

export const actionColumn = configureColumn<BasePopulatedUser>({
  title: '',
  width: 2,
  extractor: function getAction(user: BasePopulatedUser) {
    return (
      <div style={{ display: 'flex' }}>
        <PrimaryButton
          size="mini"
          onClick={() => approveUser(user)}
          content="Approve"
        />
        <SecondaryButton
          size="mini"
          onClick={() => rejectUser(user)}
          content="Decline"
          border
        />
      </div>
    );
  },
});

export const rejectionColumn = configureColumn<BasePopulatedUser>({
  id: 'onboardReasoning',
  title: 'Rejection Reasoning',
  extractor: 'onboardReasoning',
});

export const titleColumn = buildColumn({
  title: 'Title',
  width: 3,
  extractor: 'title',
});

export const descriptionColumn = buildColumn<Pick<Pitch, 'description'>>({
  title: 'Description',
  width: 5,
  extractor: function getDescription(pitch) {
    return (
      <div
        style={{
          textOverflow: 'ellipsis',
          wordWrap: 'break-word',
          maxHeight: '3.6em',
          lineHeight: '1.8em',
        }}
      >
        {pitch.description}
      </div>
    );
  },
});

export const associatedInterestsColumn = buildColumn<
  Pick<BasePopulatedPitch, 'topics'>
>({
  title: 'Associated Interests',
  extractor: function getInterests(pitch) {
    return <TagList size="tiny" tags={pitch.topics} />;
  },
});

export const claimableTeamsColumn = buildColumn<ClaimableTeamsPitch>({
  title: 'Teams You Can Claim',
  extractor: function getTeams(pitch) {
    return <ClaimableTeamsList pitch={pitch} />;
  },
});

export const submittedColumn = buildColumn<Pick<BasePopulatedPitch, 'author'>>({
  title: 'Submitter',
  width: 2,
  extractor: function getSubmitter(pitch) {
    return <UserChip user={pitch.author} />;
  },
});

export const selfWriteColumn = buildColumn<Pick<BasePopulatedPitch, 'writer'>>({
  title: 'Self-write',
  width: 1,
  extractor: function getSelfWrite(pitch) {
    return pitch.writer ? (
      <div>
        <Icon color="green" name="check" />
      </div>
    ) : (
      <></>
    );
  },
});

export const googleDocColumn = buildColumn<
  Pick<BasePopulatedPitch, 'assignmentGoogleDocLink'>
>({
  title: 'Google Doc',
  width: 1,
  extractor: function getGoogleDoc(pitch) {
    return (
      <LinkDisplay
        style={{ fontSize: '1.25em' }}
        href={pitch.assignmentGoogleDocLink}
      />
    );
  },
});

export const deadlineColumn = buildColumn<Pick<BasePopulatedPitch, 'deadline'>>(
  {
    title: 'Deadline',
    width: 1,
    extractor: function getDeadline({ deadline }) {
      return new Date(deadline).toLocaleDateString();
    },
  },
);

export const unclaimedTeamsColumn = buildColumn<ClaimableTeamsPitch>({
  title: 'Unclaimed Teams',
  width: 2,
  extractor: function GetUnclaimedTeams({ ...pitch }) {
    const { user } = useAuth();

    return (
      <div>
        <TagList
          size="tiny"
          tags={getClaimableTeams(user!, pitch).map((team) => team.teamId)}
        />
      </div>
    );
  },
});

export const teamsRequireApprovalColumn = buildColumn<BasePopulatedPitch>({
  title: 'Teams Requring Approval',
  width: 2,
  extractor: function GetTeams({ pendingContributors }) {
    const { getTeamFromId } = useTeams();
    const teamIds = [
      ...new Set(pendingContributors.map((c) => c.teams).flat()),
    ];

    return (
      <TagList
        size="tiny"
        tags={teamIds.map(getTeamFromId).filter((team) => team !== undefined)}
      />
    );
  },
});

export const pitchStatusCol = buildColumn<Pick<BasePopulatedPitch, 'status'>>({
  title: 'Status',
  width: '1',
  extractor: function StatusCell({ status }) {
    return <FieldTag content={status} size={'small'} />;
  },
});

export const dateSubmittedCol = buildColumn<
  Pick<BasePopulatedPitch, 'createdAt'>
>({
  title: 'Date Submitted',
  width: '1',
  extractor: function DateCell(pitch) {
    return new Date(pitch.createdAt).toLocaleDateString();
  },
});

export const associatedTeamsColumn = buildColumn<
  BasePopulatedPitch | FullPopulatedPitch
>({
  title: "Teams You're On",
  width: 1,
  extractor: function TeamsCell(pitch) {
    const { user } = useAuth();
    return (
      <div>
        <TagList
          size="tiny"
          tags={getPitchTeamsForContributor(pitch, user!)!}
        />
      </div>
    );
  },
});

export const requestedTeamsColumn = buildColumn<BasePopulatedPitch>({
  title: 'Team(s) Requested to Claim',
  width: '2',
  extractor: function TeamsCell(pitch) {
    const { user } = useAuth();
    const { getTeamFromId } = useTeams();
    const { teams } = findPendingContributor(pitch, user!) ?? { teams: [] };

    return (
      <div>
        <TagList size="tiny" tags={teams.map(getTeamFromId)} />
      </div>
    );
  },
});

export const claimStatusColumn = buildColumn<
  FullPopulatedPitch | BasePopulatedPitch
>({
  title: 'Status',
  width: '1',
  extractor: function StatusCell(pitch) {
    const { user } = useAuth();
    return (
      <FieldTag
        content={getUserClaimStatusForPitch(pitch, user!)}
        size={'small'}
      />
    );
  },
});

export const publishDateColumn = buildColumn<FullPopulatedPitch>({
  title: 'Publish Date',
  width: '1',
  extractor: function DateCell(pitch) {
    if (!pitch.issues || pitch.issues.length <= 0) {
      return undefined;
    }

    return new Date(pitch.issues[0].releaseDate).toLocaleDateString();
  },
});

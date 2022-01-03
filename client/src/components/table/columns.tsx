import React from 'react';
import { Icon } from 'semantic-ui-react';
import {
  BasePopulatedPitch,
  BasePopulatedUser,
  FullPopulatedPitch,
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
  getClaimableTeams,
} from '../list/ClaimableTeamsList';
import { TagList } from '../list/TagList';
import UserChip from '../tag/UserChip';
import { LinkDisplay } from '../ui/LinkDisplayButton';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';

export const profilePic = buildColumn({
  title: '',
  width: 1,
  extractor: function Pic(user: BasePopulatedUser) {
    return (
      <UserPicture style={{ width: '25px', margin: 'auto' }} user={user} />
    );
  },
});

export const nameColumn = buildColumn({
  title: 'Name',
  width: 2,
  extractor: function getName(user: BasePopulatedUser) {
    return `${user.fullname} (${user.pronouns.join('/')})`;
  },
  sorter: (a, b) => a.fullname.localeCompare(b.fullname),
});

export const roleColumn = buildColumn({
  title: 'Role',
  width: 2,
  extractor: function getRoles(user: BasePopulatedUser) {
    return <FieldTag size="tiny" content={user.role} />;
  },
});

export const teamsColumn = buildColumn({
  title: 'Teams',
  width: 2,
  extractor: function getTeams(user: BasePopulatedUser) {
    return <TagList size="tiny" tags={user.teams} />;
  },
});

export const interestsColumn = buildColumn({
  title: 'Interests',
  extractor: function getInterests(user: BasePopulatedUser) {
    return <TagList size="tiny" tags={user.interests} />;
  },
});

export const statusColumn = buildColumn({
  title: 'Status',
  width: 1,
  extractor: function getStatus(user: BasePopulatedUser) {
    return <FieldTag size="tiny" content={user.activityStatus} />;
  },
});

export const ratingColumn = buildColumn({
  title: 'Rating',
  width: 2,
  extractor: function getRating(user: BasePopulatedUser) {
    return `${user.rating ? user.rating.toFixed(2) : '-'} / 5`;
  },
});

export const joinedColumn = buildColumn({
  title: 'Joined',
  width: 2,
  extractor: function getJoined(user: BasePopulatedUser) {
    return new Date(user.dateJoined).toLocaleDateString();
  },
});

export const actionColumn = buildColumn({
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

export const rejectionColumn = buildColumn({
  title: 'Rejection Reasoning',
  extractor: 'onboardReasoning',
});

export const titleColumn = buildColumn({
  title: 'Title',
  width: 3,
  extractor: 'title',
});

export const descriptionColumn = buildColumn<BasePopulatedPitch>({
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

export const associatedInterestsColumn = buildColumn<BasePopulatedPitch>({
  title: 'Associated Interests',
  extractor: function getInterests(pitch) {
    return <TagList size="tiny" tags={pitch.topics} />;
  },
});

export const claimableTeamsColumn = buildColumn<BasePopulatedPitch>({
  title: 'Teams You Can Claim',
  extractor: function getTeams(pitch) {
    return <ClaimableTeamsList pitch={pitch} />;
  },
});

export const submittedColumn = buildColumn<BasePopulatedPitch>({
  title: 'Submitter',
  width: 2,
  extractor: function getSubmitter(pitch) {
    return <UserChip user={pitch.author} />;
  },
});

export const selfWriteColumn = buildColumn<BasePopulatedPitch>({
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

export const googleDocColumn = buildColumn<BasePopulatedPitch>({
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

export const deadlineColumn = buildColumn<BasePopulatedPitch>({
  title: 'Deadline',
  width: 1,
  extractor: function getDeadline({ deadline }) {
    return new Date(deadline).toLocaleDateString();
  },
});

export const unclaimedTeamsColumn = buildColumn<BasePopulatedPitch>({
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

export const teamsRequireApprovalColumn = buildColumn({
  title: 'Teams Requring Approval',
  width: 2,
  extractor: function GetTeams({ pendingContributors }: BasePopulatedPitch) {
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

export const pitchStatusCol = buildColumn<BasePopulatedPitch>({
  title: 'Status',
  width: '1',
  sorter: (p1, p2) => p1.status.localeCompare(p2.status),
  extractor: function StatusCell({ status }) {
    return <FieldTag content={status} size={'small'} />;
  },
});

export const dateSubmittedCol = buildColumn<BasePopulatedPitch>({
  title: 'Date Submitted',
  width: '1',
  sorter: (p1, p2) =>
    new Date(p1.createdAt).getTime() - new Date(p2.createdAt).getTime(),
  extractor: function DateCell(pitch) {
    return new Date(pitch.createdAt).toLocaleDateString();
  },
});

export const associatedTeamsColumn = buildColumn<BasePopulatedPitch>({
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
    return findPendingContributor(pitch, user!)?.teams.map((teamId) => (
      <FieldTag content={teamId} size={'small'} key={teamId} />
    ));
  },
});

export const claimStatusColumn = buildColumn<BasePopulatedPitch>({
  title: 'Status',
  width: '1',
  sorter: (p1, p2) => p1.status.localeCompare(p2.status),
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
  sorter: (p1, p2) =>
    new Date(p1.loadedIssues && p1.loadedIssues[0].releaseDate).getTime() -
    new Date(p2.loadedIssues && p2.loadedIssues[0].releaseDate).getTime(),
  extractor: function DateCell(pitch) {
    return new Date(
      pitch.loadedIssues && pitch.loadedIssues[0].releaseDate,
    ).toLocaleDateString();
  },
});

import React from 'react';
import { Icon } from 'semantic-ui-react';
import { BasePopulatedPitch, BasePopulatedUser } from 'ssw-common';

import { buildColumn, FieldTag, UserPicture } from '..';
import { approveUser, rejectUser } from '../../api/apiWrapper';
import { useAuth, useTeams } from '../../contexts';
import {
  ClaimableTeamsList,
  getClaimableTeams,
} from '../list/ClaimableTeamsList';
import { TagList } from '../list/TagList';
import UserChip from '../tags/UserChip';
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

export const descriptionColumn = buildColumn({
  title: 'Description',
  width: 5,
  extractor: function getDescription(pitch: BasePopulatedPitch) {
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

export const associatedInterestsColumn = buildColumn({
  title: 'Associated Interests',
  extractor: function getInterests(pich: BasePopulatedPitch) {
    return <TagList size="tiny" tags={pich.topics} />;
  },
});

export const claimableTeamsColumn = buildColumn({
  title: 'Teams You Can Claim',
  extractor: function getTeams(pitch: BasePopulatedPitch) {
    return <ClaimableTeamsList pitch={pitch} />;
  },
});

export const submittedColumn = buildColumn({
  title: 'Submitter',
  width: 2,
  extractor: function getSubmitter(pitch: BasePopulatedPitch) {
    return <UserChip user={pitch.author} />;
  },
});

export const selfWriteColumn = buildColumn({
  title: 'Self-write',
  width: 1,
  extractor: function getSelfWrite(pitch: BasePopulatedPitch) {
    return pitch.writer ? (
      <div>
        <Icon color="green" name="check" />
      </div>
    ) : (
      <></>
    );
  },
});

export const googleDocColumn = buildColumn({
  title: 'Google Doc',
  width: 1,
  extractor: function getGoogleDoc(pitch: BasePopulatedPitch) {
    return (
      <LinkDisplay
        style={{ fontSize: '1.25em' }}
        href={pitch.assignmentGoogleDocLink}
      />
    );
  },
});

export const deadlineColumn = buildColumn({
  title: 'Pitch Compleltion Deadline',
  width: 2,
  extractor: function getDeadline(pitch: BasePopulatedPitch) {
    return new Date(pitch.deadline).toLocaleDateString();
  },
});

export const unclaimedTeamsColumn = buildColumn({
  title: 'Unclaimed Teams',
  width: 2,
  extractor: function GetUnclaimedTeams({ ...pitch }: BasePopulatedPitch) {
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

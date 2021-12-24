import React from 'react';
import { BasePopulatedUser } from 'ssw-common';

import { buildColumn, FieldTag, UserPicture } from '..';
import { approveUser, rejectUser } from '../../api/apiWrapper';
import { TagList } from '../list/TagList';
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

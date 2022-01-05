import React, { FC, ReactElement } from 'react';
import { BasePopulatedPitch, BasePopulatedUser, Team } from 'ssw-common';

import { useAuth } from '../../contexts';

import { TagList } from './TagList';

export type ClaimableTeamsPitch = Pick<
  BasePopulatedPitch,
  'teams' | 'primaryEditor' | 'secondEditors' | 'thirdEditors' | 'writer'
>;

interface Props {
  pitch: ClaimableTeamsPitch;
}

export const getClaimableTeams = (
  user: Pick<BasePopulatedUser, 'role' | 'teams'>,
  pitch: ClaimableTeamsPitch | null,
): { teamId: Team; target: number }[] => {
  if (pitch === null) {
    return [];
  }
  const isAdmin = user.role === 'ADMIN';
  const isStaff = user.role === 'STAFF';

  const writing = user!.teams.filter(
    (team) => team.name.toLowerCase() === 'writing',
  );
  const editing = user!.teams.filter(
    (team) => team.name.toLowerCase() === 'editing',
  );

  const numberOfEditorsNeeded =
    (pitch.primaryEditor ? 0 : 1) +
    (pitch.secondEditors.length ? 1 : 0) +
    pitch.thirdEditors.length
      ? 1
      : 0;
  const EDITING_TEAM =
    (isAdmin && editing.length > 0 && pitch.primaryEditor !== null) ||
    (isStaff &&
      editing.length > 0 &&
      (pitch.secondEditors.length < 1 || pitch.thirdEditors.length < 1))
      ? { teamId: editing[0], target: numberOfEditorsNeeded }
      : null;
  const WRITING_TEAM =
    writing.length > 0 && pitch?.writer === null
      ? { teamId: writing[0], target: 1 }
      : null;

  const teams = pitch?.teams
    .filter((team) => team.target > 0)
    .filter(
      (team) =>
        user!.teams.findIndex((myTeam) => myTeam._id === team.teamId._id) > 0,
    );

  if (EDITING_TEAM !== null) {
    teams.push(EDITING_TEAM);
  }

  if (WRITING_TEAM !== null) {
    teams.push(WRITING_TEAM);
  }

  return teams;
};

export const ClaimableTeamsList: FC<Props> = ({ pitch }): ReactElement => {
  const { user } = useAuth();

  const teams = getClaimableTeams(user!, pitch);

  return <TagList size="tiny" tags={teams.map((t) => t.teamId)} />;
};

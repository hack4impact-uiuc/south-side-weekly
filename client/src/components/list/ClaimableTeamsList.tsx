import React, { FC, ReactElement } from 'react';
import { BasePopulatedPitch } from 'ssw-common';

import { useAuth } from '../../contexts';

import { TagList } from './TagList';

interface Props {
  pitch: BasePopulatedPitch;
}

export const ClaimableTeamsList: FC<Props> = ({ pitch }): ReactElement => {
  const { user, isAdmin, isStaff } = useAuth();

  const writing = user!.teams.filter(
    (team) => team.name.toLowerCase() === 'writing',
  );
  const editing = user!.teams.filter(
    (team) => team.name.toLowerCase() === 'editing',
  );

  const EDITING_TEAM =
    (isAdmin && editing.length > 0 && pitch.primaryEditor !== null) ||
    (isStaff &&
      editing.length > 0 &&
      (pitch.secondEditors.length < 2 || pitch.thirdEditors.length < 3))
      ? editing
      : [];
  const WRITING_TEAM =
    writing.length > 0 && pitch.writer === null ? writing : [];

  const teams = pitch.teams
    .filter((team) => team.target > 0)
    .filter(
      (team) =>
        user!.teams.findIndex((myTeam) => myTeam._id === team.teamId._id) > 0,
    );

  return (
    <TagList
      size="tiny"
      tags={[...teams.map((t) => t.teamId), ...EDITING_TEAM, ...WRITING_TEAM]}
    />
  );
};

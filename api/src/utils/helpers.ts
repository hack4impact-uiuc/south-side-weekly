import { LeanDocument } from 'mongoose';
import { IPitch } from 'ssw-common';

import Pitch, { PitchSchema } from '../models/pitch';

export const isPitchClaimed = (pitch: IPitch): boolean =>
  getOpenTeamsForPitch(pitch).length === 0;

export const getOpenTeamsForPitch = (pitch: IPitch): IPitch['teams'] => {
  let openTeams: IPitch['teams'] = [];
  if (pitch.teams !== null && pitch.teams.length !== undefined) {
    openTeams = pitch.teams.filter((team) => team.target > 0);
  }
  return openTeams;
};

export const updatePitchTeamTargets = (
  pitch: IPitch,
  teams: string[],
): void => {
  teams.forEach((teamId) => {
    const team = pitch.teams.find(
      ({ teamId: pitchTeamId }) => pitchTeamId === teamId,
    );

    team.target--;
  });
};

export const addContributorToAssignmentContributors = async (
  pitchId: string,
  userId: string,
  team: string,
): Promise<LeanDocument<PitchSchema>> => {
  const pitchWithUser = await Pitch.findOne({
    _id: pitchId,
    'assignmentContributors.userId': userId,
  });

  let pitch;

  if (pitchWithUser) {
    console.log('WITH USER');
    pitch = await Pitch.findOneAndUpdate(
      { _id: pitchId, 'assignmentContributors.userId': userId },
      {
        $addToSet: {
          'assignmentContributors.$.teams': team,
        },
      },
      { new: true, runValidators: true },
    ).lean();
  } else {
    console.log('NO USER');
    pitch = await Pitch.findByIdAndUpdate(
      pitchId,
      {
        $addToSet: {
          assignmentContributors: { userId: userId, teams: [team] },
        },
      },
      { new: true, runValidators: true },
    ).lean();
  }

  return pitch;
};

export const updateTeamTarget = async (
  pitchId: string,
  team: string,
): Promise<LeanDocument<PitchSchema>> => {
  const pitchWithTeam = await Pitch.findOne({
    _id: pitchId,
    'teams.teamId': team,
  });

  let pitch;

  if (pitchWithTeam) {
    console.log('WITH TEAM');
    pitch = await Pitch.findOneAndUpdate(
      {
        _id: pitchId,
        'teams.teamId': team,
        'teams.target': { $gt: 0 },
      },
      {
        $inc: {
          'teams.$.target': -1,
        },
      },
      { new: true, runValidators: true },
    ).lean();
  } else {
    console.log('NO TEAM');
    pitch = await Pitch.findByIdAndUpdate(
      pitchId,
      {
        $addToSet: {
          teams: { teamId: team, target: 0 },
        },
      },
      { new: true, runValidators: true },
    ).lean();
  }

  return pitch;
};

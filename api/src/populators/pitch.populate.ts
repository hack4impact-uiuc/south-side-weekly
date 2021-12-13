import { LeanDocument } from 'mongoose';
import Pitch, { PitchSchema } from '../models/pitch';
import { PopulateType, populateTypes } from './types';
import { getPopulateOptions } from './utils';

export const populatePitch = async (
  pitch: PopulateType<PitchSchema>,
  type: populateTypes,
): Promise<PitchSchema | LeanDocument<PitchSchema>> => {
  if (type === 'none') {
    return pitch as LeanDocument<PitchSchema> | PitchSchema;
  }

  const baseOptions = [
    {
      ...getPopulateOptions<PitchSchema>('topics', 'Interest'),
    },
    { ...getPopulateOptions('teams.teamId', 'Team') },
    { ...getPopulateOptions('assignmentContributors.teams', 'Team') },
    { ...getPopulateOptions('assignmentContributors.userId', 'User') },
    { ...getPopulateOptions<PitchSchema>('author', 'User') },
    { ...getPopulateOptions<PitchSchema>('writer', 'User') },
    { ...getPopulateOptions<PitchSchema>('primaryEditor', 'User') },
    { ...getPopulateOptions<PitchSchema>('secondEditors', 'User') },
    { ...getPopulateOptions<PitchSchema>('thirdEditors', 'User') },
    { ...getPopulateOptions<PitchSchema>('reviewedBy', 'User') },
  ];

  if (type === 'default') {
    return await Pitch.populate(pitch, baseOptions);
  }

  const allOptions = [
    ...baseOptions,
    { ...getPopulateOptions<PitchSchema>('issues', 'Issue') },
    { ...getPopulateOptions('issueStatuses.issueId', 'Issue') },
    { ...getPopulateOptions('pendingContributors.userId', 'User') },
    { ...getPopulateOptions('pendingContributors.teams', 'Team') },
  ];

  return await Pitch.populate(pitch, allOptions);
};

export const popoulatePitches = async (
  pitches: PopulateType<PitchSchema>,
  type: populateTypes,
): Promise<PopulateType<PitchSchema[] | LeanDocument<PitchSchema[]>>> =>
  ((await populatePitch(pitches, type)) as unknown) as PopulateType<
    PitchSchema[] | LeanDocument<PitchSchema[]>
  >;

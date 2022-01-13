import { LeanDocument } from 'mongoose';
import {
  BasePopulatedPitch,
  FullPopulatedPitch,
  Pitch as PitchType,
} from 'ssw-common';

import Pitch, { PitchSchema } from '../models/pitch.model';
import { PopulateType, populateTypes } from './types';
import { getPopulateOptions } from './utils';

export const populatePitch = async (
  pitch: PopulateType<PitchSchema>,
  type: populateTypes,
): Promise<FullPopulatedPitch | BasePopulatedPitch | PitchType> => {
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
    { ...getPopulateOptions('issueStatuses.issueId', 'Issue') },
  ];

  if (type === 'default') {
    return await Pitch.populate(pitch, baseOptions);
  }

  const allOptions = [
    ...baseOptions,
    { ...getPopulateOptions('pendingContributors.userId', 'User') },
    { ...getPopulateOptions('pendingContributors.teams', 'Team') },
  ];

  return await Pitch.populate(pitch, allOptions);
};

export const populatePitches = async (
  pitches: PopulateType<PitchSchema>,
  type: populateTypes,
): Promise<PopulateType<PitchSchema[] | LeanDocument<PitchSchema[]>>> =>
  ((await populatePitch(pitches, type)) as unknown) as PopulateType<
    PitchSchema[] | LeanDocument<PitchSchema[]>
  >;

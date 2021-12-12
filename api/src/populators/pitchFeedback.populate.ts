import PitchFeedback, { PitchFeedbackSchema } from '../models/pitchFeedback';
import { PopulateType, populateTypes } from './types';
import { getPopulateOptions } from './utils';

export const populatePitchFeedback = async (
  pitchFeedback: PopulateType<PitchFeedbackSchema>,
  type: populateTypes,
): Promise<PopulateType<PitchFeedbackSchema>> => {
  if (type === 'none') {
    return pitchFeedback;
  }

  const baseOptions = [
    { ...getPopulateOptions<PitchFeedbackSchema>('pitchId', 'Pitch') },
  ];

  return await PitchFeedback.populate(pitchFeedback, baseOptions);
};

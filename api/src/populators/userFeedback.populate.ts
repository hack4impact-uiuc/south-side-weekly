import UserFeedback, { UserFeedbackSchema } from '../models/userFeedback';
import { PopulateType, populateTypes } from './types';
import { getPopulateOptions } from './utils';

export const populateUserFeedback = async (
  userFeedback: PopulateType<UserFeedbackSchema>,
  type: populateTypes,
): Promise<PopulateType<UserFeedbackSchema>> => {
  if (type === 'none') {
    return userFeedback;
  }

  const baseOptions = [
    { ...getPopulateOptions<UserFeedbackSchema>('pitchId', 'Pitch') },
    { ...getPopulateOptions<UserFeedbackSchema>('userId', 'User') },
    { ...getPopulateOptions<UserFeedbackSchema>('staffId', 'User') },
  ];

  return await UserFeedback.populate(userFeedback, baseOptions);
};

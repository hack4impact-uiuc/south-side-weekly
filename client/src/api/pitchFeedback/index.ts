import { IPitchFeedback } from 'ssw-common';

import { Response } from '../types';
import { buildEndpoint, get } from '../builders';

import { PitchFeedbackResponse } from './types';

const PITCH_FEEDBACK_ENDPOINT = '/pitchFeedback/';

const getPitchFeedback = async (
  pitchId: string,
): Promise<Response<PitchFeedbackResponse>> => {
  const url = buildEndpoint(PITCH_FEEDBACK_ENDPOINT, 'pitch', pitchId);

  const failureMessage = 'GET_PITCH_FEEDBACK_FAIL';

  return await get(url, failureMessage);
};

export { getPitchFeedback };

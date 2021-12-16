import { Request, Response } from 'express';

import { sendNotFound, sendSuccess } from '../utils/helpers';
import { IPitchFeedback } from 'ssw-common';
import { PitchFeedbackService } from '../services';
import { extractPopulateQuery, extractOptions } from './utils';
import { populatePitchFeedback } from '../populators';

type IdParam = { id: string };

// CREATE controls

type CreateReqQuery = Partial<IPitchFeedback>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createPitchFeedback = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const feedback = await PitchFeedbackService.add(req.body);

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Feedback created',
    await populatePitchFeedback(feedback, populateType),
  );
};

// READ controls

export const getAllPitchFeedback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log(req.query);
  const options = extractOptions(req.query);
  const populateType = extractPopulateQuery(req.query);

  const feedback = await PitchFeedbackService.getAll(options);

  sendSuccess(res, 'Successfully retrieved pitch feedback for all pitches', {
    data: await populatePitchFeedback(feedback.data, populateType),
    count: feedback.count,
  });
};

type GetPitchFeedbackReq = Request<IdParam>;

export const getPitchFeedback = async (
  req: GetPitchFeedbackReq,
  res: Response,
): Promise<void> => {
  const feedback = await PitchFeedbackService.getOne(req.params.id);
  const populateType = extractPopulateQuery(req.query);

  if (!feedback) {
    sendNotFound(res, 'Pitch feedback not found');
    return;
  }

  sendSuccess(
    res,
    'Successfully retrieved pitch feedback',
    await populatePitchFeedback(feedback, populateType),
  );
};

type GetFeedbackForPitchReq = Request<IdParam>;

export const getFeedbackForPitch = async (
  req: GetFeedbackForPitchReq,
  res: Response,
): Promise<void> => {
  const options = extractOptions(req.query);
  const feedback = await PitchFeedbackService.getFeedbackForPitch(
    req.params.id,
    options,
  );

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(res, 'Successfully retrieved pitch feedback', {
    data: await populatePitchFeedback(feedback.data, populateType),
    count: feedback.count,
  });
};

// UPDATE controls

type UpdateReqBody = Partial<IPitchFeedback>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updatePitchFeedback = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const feedback = await PitchFeedbackService.update(req.params.id, req.body);

  if (!feedback) {
    sendNotFound(res, 'Pitch feedback not found');
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Successfully updated pitch feedback',
    await populatePitchFeedback(feedback, populateType),
  );
};

// DELETE controls

export const deletePitchFeedback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const deletedFeedback = await PitchFeedbackService.remove(req.params.id);

  if (!deletedFeedback) {
    sendNotFound(res, 'Pitch feedback not found');
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Successfully deleted pitch feedback',
    populatePitchFeedback(deletedFeedback, populateType),
  );
};

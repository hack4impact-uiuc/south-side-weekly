import { Request, Response } from 'express';

import PitchFeedback from '../models/pitchFeedback';
import { sendNotFound, sendSuccess } from '../utils/helpers';
import { IPitchFeedback } from 'ssw-common';

type IdParam = { id: string };

// CREATE controls

type CreateReqQuery = Partial<IPitchFeedback>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createPitchFeedback = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const createFeedback = await PitchFeedback.create(req.body);

  // Avoids returning the userId on the response
  const feedback = await PitchFeedback.findById(createFeedback._id);

  sendSuccess(res, 'Feedback created', feedback);
};

// READ controls

export const getAllPitchFeedback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const feedback = await PitchFeedback.find({});

  sendSuccess(
    res,
    'Successfully retrieved pitch feedback for all pitches',
    feedback,
  );
};

type GetPitchFeedbackReq = Request<IdParam>;

export const getPitchFeedback = async (
  req: GetPitchFeedbackReq,
  res: Response,
): Promise<void> => {
  const feedback = await PitchFeedback.findById(req.params.id);

  if (!feedback) {
    sendNotFound(res, 'Pitch feedback not found');
    return;
  }

  sendSuccess(res, 'Successfully retrieved pitch feedback', feedback);
};

type GetFeedbackForPitchReq = Request<IdParam>;

export const getFeedbackForPitch = async (
  req: GetFeedbackForPitchReq,
  res: Response,
): Promise<void> => {
  const feedback = await PitchFeedback.find({ pitchId: req.params.id });

  sendSuccess(res, 'Successfully retrieved pitch feedback', feedback);
};

// UPDATE controls

type UpdateReqBody = Partial<IPitchFeedback>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updatePitchFeedback = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const feedback = await PitchFeedback.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );

  if (!feedback) {
    sendNotFound(res, 'Pitch feedback not found');
    return;
  }

  sendSuccess(res, 'Successfully updated pitch feedback', feedback);
};

// DELETE controls

export const deletePitchFeedback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const deletedFeedback = await PitchFeedback.findByIdAndDelete(req.params.id);

  if (!deletedFeedback) {
    sendNotFound(res, 'Pitch feedback not found');
    return;
  }

  sendSuccess(res, 'Successfully deleted pitch feedback', deletedFeedback);
};

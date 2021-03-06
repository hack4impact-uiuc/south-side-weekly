import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { errorWrap } from '../middleware';

import Pitch from '../models/pitch';
import { pitchStatusEnum } from '../utils/enums';

const router = express.Router();

/**
 * Validates an ID to whether or not it is a valid MongoDB ID or not
 * @param id Potential Pitch ID to validate
 */
const isValidMongoId = (id: string): boolean => ObjectId.isValid(id);

// Gets all pitches
router.get(
  '/',
  errorWrap(async (req: Request, res: Response) => {
    const pitch = await Pitch.find({});
    res.status(200).json({
      message: `Successfully retrieved all pitches.`,
      success: true,
      result: pitch,
    });
  }),
);

// Gets pitch by pitch id
router.get(
  '/:pitchId',
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.pitchId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const pitch = await Pitch.findById(req.params.pitchId);
    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
    } else {
      res.status(200).json({
        success: true,
        result: pitch,
        message: `Successfully retrieved pitch`,
      });
    }
  }),
);

// Create a new pitch
router.post(
  '/',
  errorWrap(async (req: Request, res: Response) => {
    const newPitch = await Pitch.create(req.body);
    if (newPitch) {
      res.status(200).json({
        message: 'Successfully created new pitch',
        success: true,
        result: newPitch,
      });
    }
  }),
);

// Updates a pitch
router.put(
  '/:pitchId',
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.pitchId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const updatedPitch = await Pitch.findByIdAndUpdate(
      req.params.pitchId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedPitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated pitch',
      result: updatedPitch,
    });
  }),
);

// Deletes a pitch
router.delete(
  '/:pitchId',
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.pitchId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const deletedPitch = await Pitch.findByIdAndDelete(req.params.pitchId);

    if (!deletedPitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Pitch successfully deleted',
      result: deletedPitch,
    });
  }),
);

// Gets all pitches on the Pitch Doc (all approved but unclaimed pitches)
router.get(
  // not sure about this URL, ideally it should just be "unclaimed"
  // but it gives me error "bad id format" bc it thinks it's an id...
  '/doc/unclaimed',
  errorWrap(async (req: Request, res: Response) => {
    const pitch = await Pitch.find({
      pitchStatus: pitchStatusEnum.APPROVED,
      $expr: {
        $or: [
          { $lt: ['$currentWriters', '$targetWriters'] },
          { $lt: ['$currentEditors', '$targetEditors'] },
          { $lt: ['$currentData', '$targetData'] },
          { $lt: ['$currentVisuals', '$targetVisuals'] },
          { $lt: ['$currentIllustration', '$targetIllustration'] },
          { $lt: ['$currentPhotography', '$targetPhotography'] },
          { $lt: ['$currentFactChecking', '$targetFactChecking'] },
          { $lt: ['$currentRadio', '$targetRadio'] },
          { $lt: ['$currentLayout', '$targetLayout'] },
        ],
      },
    });
    res.status(200).json({
      message: `Successfully retrieved unclaimed pitches.`,
      success: true,
      result: pitch,
    });
  }),
);

export default router;

import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { errorWrap } from '../middleware';

import Pitch from '../models/pitch';

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
    const user = await Pitch.find({});
    res.status(200).json({
      message: `Successfully retrieved all pitches.`,
      success: true,
      result: user,
    });
  }),
);

// Gets pitch by id
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

// Gets all pitches for a specific User
router.get(
  '/all/:userId',
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.userId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const pitches = await Pitch.find({ pitchAuthor: req.params.userId });
    if (!pitches) {
      res.status(404).json({
        success: false,
        result: [],
        message: 'User has no pitches',
      });
    } else {
      res.status(200).json({
        success: true,
        result: pitches,
        message: `Successfully retrieved pitch`,
      });
    }
  }),
);

// Create a new pitch
// TODO - gracefully exit if all valid fields not met?
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

export default router;

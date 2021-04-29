import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { errorWrap } from '../middleware';

import Pitch from '../models/pitch';
import User from '../models/user';
import { pitchStatusEnum } from '../utils/enums';

const router = express.Router();

/**
 * Validates an ID to whether or not it is a valid MongoDB ID or not
 * @param id Potential Pitch ID to validate
 */
const isValidMongoId = (id: string): boolean => ObjectId.isValid(id);

// Gets pitches
router.get(
  '/',
  errorWrap(async (req: Request, res: Response) => {
    if (req.query.unclaimed === 'true') {
      // Gets all unclaimed pitches
      const pitches = await Pitch.find({
        pitchStatus: pitchStatusEnum.APPROVED,
        $expr: {
          $or: [
            { $lt: ['$teams.writers.current', '$teams.writers.target'] },
            { $lt: ['$teams.editors.current', '$teams.editors.target'] },
            { $lt: ['$teams.visuals.current', '$teams.visuals.target'] },
            {
              $lt: [
                '$teams.illustration.current',
                '$teams.illustration.target',
              ],
            },
            {
              $lt: ['$teams.photography.current', '$teams.photography.target'],
            },
            {
              $lt: [
                '$teams.factChecking.current',
                '$teams.factChecking.target',
              ],
            },
          ],
        },
      });
      res.status(200).json({
        message: `Successfully retrieved unclaimed pitches.`,
        success: true,
        result: pitches,
      });
    } else {
      // Gets all pitches
      const pitches = await Pitch.find({});
      res.status(200).json({
        message: `Successfully retrieved all pitches.`,
        success: true,
        result: pitches,
      });
    }
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

// Gets open teams by pitch id
router.get(
  '/:pitchId/openTeams',
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.pitchId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const pitch = await Pitch.findById(req.params.pitchId);
    const openTeams = Object.fromEntries(
      Object.entries(pitch.teams).filter(([, spots]) => spots.target > 0),
    );

    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
    } else {
      res.status(200).json({
        success: true,
        result: openTeams,
        message: `Successfully retrieved open pitches`,
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

// Adds a contributor to the assignmentContributors array
router.put(
  '/:pitchId/contributors',
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.pitchId)) {
      res.status(400).json({
        success: false,
        message: 'Bad pitch ID format',
      });
      return;
    } else if (!isValidMongoId(req.body.userId)) {
      res.status(400).json({
        success: false,
        message: 'Bad user ID format',
      });
      return;
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    }

    const updatedPitch = await Pitch.findByIdAndUpdate(
      req.params.pitchId,
      { $addToSet: { assignmentContributors: req.body.userId } },
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
      message: 'Successfully updated assignmentContributors',
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

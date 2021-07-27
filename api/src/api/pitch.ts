import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';
import { requireRegistered, requireStaff } from '../middleware/auth';

import Pitch from '../models/pitch';
import User from '../models/user';
import { pitchStatusEnum } from '../utils/enums';
import { isPitchClaimed } from '../utils/helpers';

const router = express.Router();

router.get(
  '/all',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const pitches = await Pitch.find({});
    res.status(200).json({
      message: 'Successfully retrieved all pitches',
      success: true,
      result: pitches,
    });
  }),
);

// All pitches pending approval
router.get(
  '/all/pending',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const pitches = await Pitch.find({
      pitchStatus: pitchStatusEnum.PENDING,
    });

    res.status(200).json({
      success: true,
      message: 'Pending pitches successfully retrived',
      result: pitches,
    });
  }),
);

// All approved pitches
// query param: status (claimed or unclaimed) that
//              gets the claimed/unclaimed pitches
router.get(
  '/all/approved',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const pitches = await Pitch.find({
      pitchStatus: pitchStatusEnum.APPROVED,
    });
    const status = req.query.status;

    if (status === 'unclaimed') {
      res.status(200).json({
        message: 'Successfully retrieved unclaimed pitches',
        success: true,
        result: pitches.filter((pitch) => !isPitchClaimed(pitch)),
      });
    } else if (status === 'claimed') {
      res.status(200).json({
        message: 'Successfully retrieved unclaimed pitches',
        success: true,
        result: pitches.filter(isPitchClaimed),
      });
    } else {
      res.status(200).json({
        message: `Successfully retrieved approved pitches.`,
        success: true,
        result: pitches,
      });
    }
  }),
);

router.get(
  '/all/pendingClaims',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const pitches = await Pitch.find({
      'pendingContributors.0': { $exists: true },
    });

    res.status(200).json({
      success: true,
      message: 'Pending pitches successfully retrived',
      result: pitches,
    });
  }),
);

// Gets pitch by pitch id
router.get(
  '/:pitchId',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const pitch = await Pitch.findById(req.params.pitchId);
    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }
    res.status(200).json({
      success: true,
      result: pitch,
      message: `Successfully retrieved pitch`,
    });
  }),
);

// Gets open teams by pitch id
router.get(
  '/:pitchId/openTeams',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const pitch = await Pitch.findById(req.params.pitchId);

    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }
    const openTeams = Object.fromEntries(
      Object.entries(pitch.teams).filter(([, spots]) => spots.target > 0),
    );

    res.status(200).json({
      success: true,
      result: openTeams,
      message: `Successfully retrieved open pitches`,
    });
  }),
);

// Create a new pitch
router.post(
  '/',
  requireRegistered,
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
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
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
  requireStaff,
  errorWrap(async (req: Request, res: Response) => {
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
      { $addToSet: { pendingContributors: req.body.userId } },
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
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
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

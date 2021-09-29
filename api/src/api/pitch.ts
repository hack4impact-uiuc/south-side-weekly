import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';
import {
  requireAdmin,
  requireRegistered,
  requireStaff,
} from '../middleware/auth';
import pitch from '../models/pitch';

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
      status: pitchStatusEnum.PENDING,
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
      status: pitchStatusEnum.APPROVED,
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

// Approve a pitch
router.put(
  '/:pitchId/approve',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const { teams } = req.body;

    const pitch = await Pitch.findByIdAndUpdate(req.params.pitchId, {
      $set: {
        status: pitchStatusEnum.APPROVED,
        approvedBy: req.user._id,
        teams: teams,
      },
    });

    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated pitch',
      result: pitch,
    });
  }),
);

// Decline a pitch
router.put(
  '/:pitchId/decline',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const pitch = await Pitch.findByIdAndUpdate(req.params.pitchId, {
      $set: {
        status: pitchStatusEnum.REJECTED,
      },
    });

    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated pitch',
      result: pitch,
    });
  }),
);

// Adds a contributor to the pendingContributors array
// TODO: modify the pitch schema to also tell which team the user is claiming for
router.put(
  '/:pitchId/submitClaim',
  requireRegistered,
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
      {
        $addToSet: {
          pendingContributors: { userId: req.body.userId, team: req.body.team },
        },
      },
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
      message: 'Successfully updated pendingContributors',
      result: updatedPitch,
    });
  }),
);

// Approves a claim on a pitch
router.put(
  '/:pitchId/approveClaim',
  requireStaff,
  errorWrap(async (req: Request, res: Response) => {
    const { userId, team } = req.body;

    // Remove the user from the pending contributors and add it to the the assignment contributors
    const pitch = await Pitch.findByIdAndUpdate(
      req.params.pitchId,
      {
        $pull: {
          pendingContributors: {userId: userId, team: team}, 
        },
        $addToSet: {
          assignmentContributors: {userId: userId, team: team},
        },
      },
      { returnOriginal: false, runValidators: true },
    );

    // Add the pitch to the user's claimed Pitches
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          claimedPitches: req.params.pitchId,
        },
      },
      { returnOriginal: false },
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    } else if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully approved claim',
      result: pitch,
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

import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';
import {
  requireAdmin,
  requireRegistered,
  requireStaff,
} from '../middleware/auth';

import Pitch from '../models/pitch';
import User from '../models/user';
import { aggregatePitch } from '../utils/aggregate-utils';
import { pitchStatusEnum } from '../utils/enums';
import { isPitchClaimed } from '../utils/helpers';
import { sendMail } from '../utils/mailer';
import {
  approvedMessage,
  declinedMessage,
  approveClaim,
  declineClaim,
} from '../utils/mailer-templates';
import { processFilters, processPaignation } from '../utils/user-utils';

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
    const query = Pitch.find({
      status: pitchStatusEnum.PENDING,
    });

    processFilters(req, query);
    processPaignation(req, query);

    const pitches = await query.exec();

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
    const query = Pitch.find({
      status: pitchStatusEnum.APPROVED,
    });

    processPaignation(req, query);
    processFilters(req, query);
    let pitches = await query.exec();

    const status = req.query.claimStatus;
    if (status === 'unclaimed') {
      pitches = pitches.filter((pitch) => !isPitchClaimed(pitch));
    } else if (status === 'claimed') {
      pitches = pitches.filter(isPitchClaimed);
    }

    res.status(200).json({
      message: `Successfully retrieved pitches.`,
      success: true,
      result: pitches,
    });
  }),
);

router.get(
  '/all/pendingClaims',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const query = Pitch.find({
      'pendingContributors.0': { $exists: true },
    });

    processFilters(req, query);
    processPaignation(req, query);

    const pitches = await query.exec();

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

router.get(
  '/:pitchId/aggregate',
  errorWrap(async (req: Request, res: Response) => {
    const pitch = await Pitch.findById(req.params.pitchId).lean();
    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }

    const aggregatedPitch = await aggregatePitch(pitch);

    res.status(200).json({
      success: true,
      result: aggregatedPitch,
      message: 'Successfully aggregated pitch',
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

    await User.findByIdAndUpdate(newPitch.author, {
      $addToSet: {
        submittedPitches: newPitch._id,
      },
      lastActive: new Date(),
    });

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
    const { pitchData, response } = req.body;

    //TODO: Add response to mail message
    console.log(response);

    const pitch = await Pitch.findByIdAndUpdate(req.params.pitchId, {
      status: pitchStatusEnum.APPROVED,
      reviewedBy: req.user._id,
      ...pitchData,
    });

    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }

    const aggregatedPitch = await aggregatePitch(pitch);
    const message = approvedMessage(aggregatedPitch, req.user);
    await sendMail(message);
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
        status: pitchStatusEnum.DECLINED,
        reviewedBy: req.user._id,
      },
    }).lean();

    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }
    const aggregatedPitch = await aggregatePitch(pitch);
    const message = declinedMessage(aggregatedPitch, req.user);
    await sendMail(message);
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
          pendingContributors: {
            userId: req.body.userId,
            teams: req.body.teams,
            message: req.body.message,
            dateSubmitted: new Date(),
            status: pitchStatusEnum.PENDING,
          },
        },
      },
      { new: true, runValidators: true },
    );

    await User.findByIdAndUpdate(user._id, {
      $addToSet: {
        submittedClaims: updatedPitch._id,
      },
    });

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
    const { userId, teams } = req.body;
    // Remove the user from the pending contributors and add it to the the assignment contributors
    const pitch = await Pitch.findByIdAndUpdate(
      req.params.pitchId,
      {
        $pull: {
          pendingContributors: { userId: userId, teams: teams },
        },
        //TODO: Target in teams should decrease after
        $addToSet: {
          assignmentContributors: { userId: userId, teams: teams },
        },
      },
      { new: true, runValidators: true },
    ).lean();

    // Add the pitch to the user's claimed Pitches
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          claimedPitches: req.params.pitchId,
        },
        $pull: {
          submittedClaims: req.params.pitchId,
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
    const aggregatedPitch = await aggregatePitch(pitch);
    const message = await approveClaim(user, aggregatedPitch, req.user);
    await sendMail(message);
    res.status(200).json({
      success: true,
      message: 'Successfully approved claim',
      result: pitch,
    });
  }),
);

router.put(
  '/:pitchId/declineClaim',
  requireStaff,
  errorWrap(async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'No user ID provided',
      });

      return;
    }

    const pitch = await Pitch.findOneAndUpdate(
      { _id: req.params.pitchId, 'pendingContributors.userId': userId },
      {
        $set: {
          'pendingContributors.$.status': pitchStatusEnum.DECLINED,
        },
      },
      { new: true, runValidators: true },
    ).lean();

    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }
    const claimUser = await User.findById(userId);
    const aggregatedPitch = await aggregatePitch(pitch);
    const message = declineClaim(claimUser, aggregatedPitch, req.user);
    await sendMail(message);
    res.status(200).json({
      success: true,
      message: 'Successfully declined claim',
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

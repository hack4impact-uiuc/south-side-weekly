import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';
import {
  requireAdmin,
  requireRegistered,
  requireStaff,
} from '../middleware/auth';

import Pitch from '../models/pitch';
import User from '../models/user';
import Team from '../models/user';
import { aggregatePitch } from '../utils/aggregate-utils';
import { pitchStatusEnum } from '../utils/enums';
import {
  addContributorToAssignmentContributors,
  isPitchClaimed,
  updateTeamTarget,
} from '../utils/helpers';
import { sendMail } from '../utils/mailer';
import {
  approvedMessage,
  declinedMessage,
  approveClaim,
  declineClaim,
} from '../utils/mailer-templates';

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

// Updates a pitch team target
router.put(
  '/:pitchId/teamTarget',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const { teamId, target } = req.body;

    let updatedPitch = await Pitch.findOneAndUpdate(
      { _id: req.params.pitchId, 'teams.teamId': teamId },
      { 'teams.$.target': target },
      { new: true, runValidators: true },
    );

    if (!updatedPitch) {
      updatedPitch = await Pitch.findOneAndUpdate(
        { _id: req.params.pitchId },
        { $addToSet: { teams: { teamId: teamId, target: target } } },
        { new: true, runValidators: true },
      );
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated pitch team target',
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
    const { userId, teams, teamId } = req.body;

    // Remove the user from the pending contributors and add it to the the assignment contributors

    let pitch = await Pitch.findOneAndUpdate(
      { _id: req.params.pitchId, 'pendingContributors.userId': userId },
      {
        $pull: {
          'pendingContributors.$.teams': teamId,
        },
      },
      { new: true, runValidators: true },
    ).lean();

    pitch = await addContributorToAssignmentContributors(
      req.params.pitchId,
      userId,
      teamId,
    );

    pitch = await updateTeamTarget(req.params.pitchId, teamId);

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
    sendMail(message);

    res.status(200).json({
      success: true,
      message: 'Successfully approved claim',
      result: pitch,
    });
  }),
);

//Change Editor Type on pitch
router.put(
  '/:pitchId/changeEditorType',
  requireStaff,
  errorWrap(async (req: Request, res: Response) => {
    const { userId } = req.body;

    let pitch;

    if (req.query.from === 'First') {
      pitch = await Pitch.findByIdAndUpdate(
        req.params.pitchId,
        {
          primaryEditor: null,
          $addToSet: {
            ...(req.query.to === 'Seconds'
              ? { secondEditors: userId }
              : { thirdEditors: userId }),
          },
        },
        { new: true, runValidators: true },
      );
    } else if (req.query.to === 'First') {
      pitch = await Pitch.findByIdAndUpdate(
        req.params.pitchId,
        {
          primaryEditor: userId,
          $pull: {
            ...(req.query.from === 'Seconds'
              ? { secondEditors: userId }
              : { thirdEditors: userId }),
          },
        },
        { new: true, runValidators: true },
      );
    } else if (req.query.from === 'Seconds' || req.query.from === 'Thirds') {
      pitch = await Pitch.findByIdAndUpdate(
        req.params.pitchId,
        {
          $pull: {
            ...(req.query.from === 'Seconds'
              ? { secondEditors: userId }
              : { thirdEditors: userId }),
          },
          $addToSet: {
            ...(req.query.to === 'Seconds'
              ? { secondEditors: userId }
              : { thirdEditors: userId }),
          },
        },
        { new: true, runValidators: true },
      );
    }

    res.status(200).json({
      success: true,
      message: 'Successfully changed editor',
      result: pitch,
    });
  }),
);

// Adds an assignment contributor to a pitch
router.put(
  '/:pitchId/addContributor',
  requireStaff,
  errorWrap(async (req: Request, res: Response) => {
    const { userId, team } = req.body;

    // Check if user already exists in assignmentContributors

    let pitch;
    if (req.query.editor === 'First') {
      pitch = await Pitch.findByIdAndUpdate(
        req.params.pitchId,
        {
          primaryEditor: userId,
        },
        { new: true, runValidators: true },
      ).lean();
    } else if (
      req.query.editor === 'Seconds' ||
      req.query.editor === 'Thirds'
    ) {
      pitch = await Pitch.findByIdAndUpdate(
        req.params.pitchId,
        {
          $addToSet: {
            ...(req.query.editor === 'Seconds'
              ? { secondEditors: userId }
              : { thirdEditors: userId }),
          },
        },
        { new: true, runValidators: true },
      ).lean();
    } else {
      pitch = await addContributorToAssignmentContributors(
        req.params.pitchId,
        userId,
        team,
      );
    }

    pitch = await updateTeamTarget(req.params.pitchId, team);

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

    //TODO: Add mail for adding contributor
    /* const claimUser = await User.findById(userId);
    const aggregatedPitch = await aggregatePitch(pitch);
    const message = await approveClaim(
      claimUser,
      aggregatedPitch,
      req.user,
      teams,
    );
    await sendMail(message); */
    res.status(200).json({
      success: true,
      message: 'Successfully added contributor',
      result: pitch,
    });
  }),
);

// Remove an assignment contributor from a pitch
router.put(
  '/:pitchId/removeContributor',
  requireStaff,
  errorWrap(async (req: Request, res: Response) => {
    const { userId, team } = req.body;

    let pitch;

    if (req.query.editor === 'First') {
      pitch = await Pitch.findByIdAndUpdate(
        req.params.pitchId,
        {
          primaryEditor: null,
        },
        { new: true, runValidators: true },
      ).lean();
    } else if (
      req.query.editor === 'Seconds' ||
      req.query.editor === 'Thirds'
    ) {
      pitch = await Pitch.findByIdAndUpdate(
        req.params.pitchId,
        {
          $pull: {
            ...(req.query.editor === 'Seconds'
              ? { secondEditors: userId }
              : { thirdEditors: userId }),
          },
        },
        { new: true, runValidators: true },
      ).lean();
    } else {
      pitch = await Pitch.findOneAndUpdate(
        { _id: req.params.pitchId, 'assignmentContributors.userId': userId },
        {
          $pull: {
            'assignmentContributors.$.teams': team,
          },
        },
        { new: true, runValidators: true },
      ).lean();
    }

    console.log(userId, team, pitch);

    // Remove the pitch from the user's claimed Pitches
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          claimedPitches: req.params.pitchId,
        },
      },
      { returnOriginal: false },
    );

    pitch = await Pitch.findOneAndUpdate(
      {
        _id: req.params.pitchId,
        'teams.teamId': team,
      },
      {
        $inc: {
          'teams.$.target': 1,
        },
      },
      { new: true, runValidators: true },
    ).lean();

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

    //TODO: Add mail for adding contributor
    /* const claimUser = await User.findById(userId);
    const aggregatedPitch = await aggregatePitch(pitch);
    const message = await approveClaim(
      claimUser,
      aggregatedPitch,
      req.user,
      teams,
    );
    await sendMail(message); */
    res.status(200).json({
      success: true,
      message: 'Successfully removed contributor',
      result: pitch,
    });
  }),
);

router.put(
  '/:pitchId/declineClaim',
  requireStaff,
  errorWrap(async (req: Request, res: Response) => {
    const { userId, teamId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'No user ID provided',
      });

      return;
    }

    console.log(userId, teamId);

    const pitch = await Pitch.findOneAndUpdate(
      { _id: req.params.pitchId, 'pendingContributors.userId': userId },
      {
        $pull: {
          'pendingContributors.$.teams': teamId,
        },
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

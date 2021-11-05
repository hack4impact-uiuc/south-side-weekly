import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import User from '../models/user';
import Pitch from '../models/pitch';
import { getEditableFields, getViewableFields } from '../utils/user-utils';
import { requireAdmin, requireRegistered } from '../middleware/auth';
import { rolesEnum } from '../utils/enums';
import { aggregateUser } from '../utils/aggregate-utils';
import Team from '../models/team';

const router = express.Router();

// Gets all users
router.get(
  '/',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const users = await User.find({});
    res.status(200).json({
      message: `Successfully retrieved all users.`,
      success: true,
      result: users,
    });
  }),
);

// Gets user by id
router.get(
  '/:userId',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
    } else {
      res.status(200).json({
        success: true,
        result: user,
        message: `Successfully retrieved user`,
      });
    }
  }),
);

router.get(
  '/:userId/aggregate',
  errorWrap(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.userId).lean();
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
    }

    const aggregatedUser = await aggregateUser(user);

    res.status(200).json({
      success: true,
      result: aggregatedUser,
      message: 'Successfully retrieved aggregated user',
    });
  }),
);

// Gets a users permissions
router.get(
  '/:userId/permissions',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    res.json({
      success: true,
      result: {
        view: getViewableFields(req.user, req.params.userId),
        edit: getEditableFields(req.user, req.params.userId),
      },
    });
  }),
);

// Create a new user
router.post(
  '/',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const newUser = await User.create(req.body);
    if (newUser) {
      res.status(200).json({
        message: 'Successfully created new user',
        success: true,
        result: newUser,
      });
    }
  }),
);

// Updates a user
router.put(
  '/:userId',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated user',
      result: updatedUser,
    });
  }),
);

// Deletes a user
router.delete(
  '/:userId',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User successfully deleted',
      result: deletedUser,
    });
  }),
);

// Add pitch to a user's claimed pitches
router.put(
  '/:userId/pitches',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const pitch = await Pitch.findById(req.body.pitchId);
    if (!pitch) {
      res.status(404).json({
        success: false,
        message: 'Pitch not found with id',
      });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { claimedPitches: req.body.pitchId } },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully added pitch to user',
      result: updatedUser,
    });
  }),
);

// Gets all pending contributors
router.get(
  '/contributors/pending',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const users = await User.find({
      role: rolesEnum.CONTRIBUTOR,
      hasRoleApproved: false,
    });
    res.status(200).json({
      message: `Successfully retrieved all pending contributors.`,
      success: true,
      result: users,
    });
  }),
);

// Gets all pending staff
router.get(
  '/staff/pending',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const users = await User.find({
      role: rolesEnum.STAFF,
      hasRoleApproved: false,
    });
    res.status(200).json({
      message: `Successfully retrieved all pending staff.`,
      success: true,
      result: users,
    });
  }),
);

// An endpoint that requires admin status that gets all of the users with hasRoleApproved set to false
router.get(
  'all/pending',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const users = await User.find({ hasRoleApproved: false });
    res.status(200).json({
      message: `Successfully retrieved all pending users.`,
      success: true,
      result: users,
    });
  }),
);

// An endpoint that gets all users with a role of Admin
router.get(
  '/all/admins',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const users = await User.find({ role: rolesEnum.ADMIN });
    res.status(200).json({
      message: `Successfully retrieved all admins.`,
      success: true,
      result: users,
    });
  }),
);

// An endpoint that gets all users with a role of staff
router.get(
  '/all/staff',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const users = await User.find({ role: rolesEnum.STAFF });
    res.status(200).json({
      message: `Successfully retrieved all staff.`,
      success: true,
      result: users,
    });
  }),
);

// An endpoint to get all of the users on a specific team
router.get(
  '/all/team/:teamName',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const teamName = req.params.teamName;

    if (!teamName) {
      res.status(400).json({
        success: false,
        message: 'Team id is required',
      });
      return;
    }

    const team = await Team.findOne({ name: teamName }).lean();

    if (!team) {
      res.status(404).json({
        success: false,
        message: 'Team not found with name',
      });
      return;
    }

    const users = await User.find({
      teams: {
        $in: [team._id],
      },
    }).lean();

    res.status(200).json({
      message: `Successfully retrieved all users on team.`,
      success: true,
      result: users,
    });
  }),
);

// Adds new page to user's list of visited pages
router.post(
  '/visitPage',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        visitedPages: req.body.page,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
    } else {
      res.status(200).json({
        success: true,
        result: user,
        message: `Successfully added page to user's visited pages`,
      });
    }
  }),
);

export default router;

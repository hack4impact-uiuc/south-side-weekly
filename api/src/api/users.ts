import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import User from '../models/user';
import Pitch from '../models/pitch';
import Team from '../models/team';
import {
  getEditableFields,
  getViewableFields,
  searchUsers,
  processFilters,
  processPagination,
} from '../utils/user-utils';
import {
  requireAdmin,
  requireRegistered,
  requireRequestSecret,
} from '../middleware/auth';
import { onboardingStatusEnum, rolesEnum } from '../utils/enums';
import { aggregateUser } from '../utils/aggregate-utils';
import timezone from '../middleware/timezone';

import { approveUser, declineUser } from '../utils/mailer-templates';
import { sendMail } from '../utils/mailer';

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
      {
        $addToSet: { claimedPitches: req.body.pitchId },
        lastActive: new Date(),
      },
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

// Get all pending users
router.get(
  '/all/pending',
  errorWrap(async (req: Request, res: Response) => {
    const query = User.find({
      onboardingStatus: {
        $in: [
          onboardingStatusEnum.ONBOARDING_SCHEDULED,
          onboardingStatusEnum.STALLED,
        ],
      },
    });

    let totalPages = 1;
    processFilters(req, query);    
    searchUsers(req, query);
    if (req.query.page && req.query.limit) {
      const filteredDocs = await query.exec();
      const limit = parseInt(req.query.limit as string);
      totalPages = Math.ceil(filteredDocs.length / limit);
    }
    processPagination(req, query);
    const users = await query.exec();

    res.status(200).json({
      message: `Successfully retrieved all pending users.`,
      success: true,
      result: users,
      totalPages: totalPages,
    });
  }),
);

// Get all approved users
router.get(
  '/all/approved',
  errorWrap(async (req: Request, res: Response) => {
    const query = User.find({
      onboardingStatus: onboardingStatusEnum.ONBOARDED,
    });

    let totalPages = 1;
    processFilters(req, query);
    searchUsers(req, query);
    if (req.query.page && req.query.limit) {
      const filteredDocs = await query.exec();
      const limit = parseInt(req.query.limit as string);
      totalPages = Math.ceil(filteredDocs.length / limit);
    }
    processPagination(req, query);
    const users = await query.exec();

    res.status(200).json({
      message: `Successfully retrieved all approved users.`,
      success: true,
      result: users,
      totalPages: totalPages,
    });
  }),
);

// Get all rejected users
router.get(
  '/all/denied',
  errorWrap(async (req: Request, res: Response) => {
    const query = User.find({
      onboardingStatus: onboardingStatusEnum.DENIED,
    });
    let totalPages = 1;
    processFilters(req, query);
    searchUsers(req, query);
    if (req.query.page && req.query.limit) {
      const filteredDocs = await query.exec();
      const limit = parseInt(req.query.limit as string);
      totalPages = Math.ceil(filteredDocs.length / limit);
    }
    processPagination(req, query);
    const users = await query.exec();

    res.status(200).json({
      message: `Successfully retrieved all denied users.`,
      success: true,
      result: users,
      totalPages: totalPages,
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
      onboardingStatus: {
        $in: [
          onboardingStatusEnum.ONBOARDING_SCHEDULED,
          onboardingStatusEnum.STALLED,
        ],
      },
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
      onboardingStatus: {
        $in: [
          onboardingStatusEnum.ONBOARDING_SCHEDULED,
          onboardingStatusEnum.STALLED,
        ],
      },
    });
    res.status(200).json({
      message: `Successfully retrieved all pending staff.`,
      success: true,
      result: users,
    });
  }),
);

// An endpoint to get all of the users on a specific team
router.get(
  '/all/team/:teamName',
  //requireAdmin,
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

// One day short of two weeks to account for onboarding statuses
// that will switch to stalled that day.
const TWO_WEEKS_AGO = 13;
// Updates all user onboarding statuses for users who haven't been onboarded in two weeks to stalled
router.post(
  '/update-stalled',
  requireRequestSecret,
  timezone('America/Chicago'),
  errorWrap(async (req: Request, res: Response) => {
    const twoWeeksAgoDate = new Date();
    twoWeeksAgoDate.setDate(twoWeeksAgoDate.getDate() - TWO_WEEKS_AGO);

    // Find all users that were created more than two weeks ago and have a scheduled onboarding
    // and update these onboarding statuses to 'STALLED'
    await User.updateMany(
      {
        dateJoined: { $lt: twoWeeksAgoDate },
        onboardingStatus: onboardingStatusEnum.ONBOARDING_SCHEDULED,
      },
      {
        $set: {
          onboardingStatus: onboardingStatusEnum.STALLED,
        },
      },
    );

    res.status(200).json({
      success: true,
      message: 'Successfully updated user documents',
    });
  }),
);

// Approve a user, set status to onboarded
router.put(
  '/:userId/approved',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { onboardingStatus: onboardingStatusEnum.ONBOARDED },
      { new: true, runValidators: true },
    ).lean();

    const message = approveUser(updatedUser, req.user);
    await sendMail(message);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully onboarded user',
      result: updatedUser,
    });
  }),
);

// Decline a user, set status to denied
router.put(
  '/:userId/denied',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { onboardingStatus: onboardingStatusEnum.DENIED },
      { new: true, runValidators: true },
    );

    const message = declineUser(updatedUser, req.user);
    await sendMail(message);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully denied user',
      result: updatedUser,
    });
  }),
);

export default router;

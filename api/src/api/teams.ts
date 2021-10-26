import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import Team from '../models/team';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = express.Router();

// Gets team by id
router.get(
  '/:teamId',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      res.status(404).json({
        success: false,
        message: 'Team not found with id',
      });
    } else {
      res.status(200).json({
        success: true,
        result: team,
        message: `Successfully retrieved team`,
      });
    }
  }),
);

//Gets all teams
router.get(
  '/',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const teams = await Team.find({});
    res.status(200).json({
      message: `Successfully retrieved all teams.`,
      success: true,
      result: teams,
    });
  }),
);

// // Gets a users permissions
// router.get(
//   '/:userId/permissions',
//   requireRegistered,
//   errorWrap(async (req: Request, res: Response) => {
//     res.json({
//       success: true,
//       result: {
//         view: getViewableFields(req.user, req.params.userId),
//         edit: getEditableFields(req.user, req.params.userId),
//       },
//     });
//   }),
// );

// Create a new team
router.post(
  '/',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const newTeam = await Team.create(req.body);
    if (newTeam) {
      res.status(200).json({
        message: 'Successfully created new team',
        success: true,
        result: newTeam,
      });
    }
  }),
);

// Updates a team
router.put(
  '/:teamId',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.teamId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedTeam) {
      res.status(404).json({
        success: false,
        message: 'Team not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated team',
      result: updatedTeam,
    });
  }),
);

export default router;

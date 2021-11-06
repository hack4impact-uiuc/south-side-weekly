import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import Team from '../models/team';
import { requireAdmin, requireRegistered } from '../middleware/auth';
import { ITeam } from 'ssw-common';

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

// Create many new teams
router.post(
  '/many',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const newTeams: Partial<ITeam>[] = req.body.teams;

    const createdTeams = await Promise.all(
      newTeams.map(async (team) => Team.create(team)),
    );

    const failedTeams = createdTeams.filter((team) => !team);

    if (failedTeams.length > 0) {
      const failedTeamNames = failedTeams.map((team) => team.name);

      res.status(400).json({
        message: `Failed to create teams: ${failedTeamNames.join(', ')}`,
        success: false,
      });
    }

    res.status(200).json({
      message: 'Successfully created all teams',
      success: true,
      result: createdTeams,
    });
  }),
);

// Update many changed teams
router.put(
  '/update/many',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const changedTeams: ITeam[] = req.body.teams;
    const updatedTeams = await Promise.all(
      changedTeams.map(async (team) => {
        const body = {
          name: team.name,
          color: team.color,
          active: team.active,
        };

        return Team.findByIdAndUpdate(team._id, body, {
          new: true,
          runValidators: true,
        });
      }),
    );

    const failedTeams = updatedTeams.filter((team) => !team);

    if (failedTeams.length > 0) {
      const failedTeamNames = failedTeams.map((team) => team.name);

      res.status(400).json({
        message: `Failed to update teams: ${failedTeamNames.join(', ')}`,
        success: false,
      });
    }

    res.status(200).json({
      message: 'Successfully updated all teams',
      success: true,
      result: updatedTeams,
    });
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

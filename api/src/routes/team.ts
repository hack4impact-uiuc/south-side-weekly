import { Router } from 'express';

import { errorWrap } from '../middleware';
import * as teamController from '../controllers/team.controller';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/teams
router.get('/', requireRegistered, errorWrap(teamController.getTeams));

// GET /api/teams/:id
router.get('/:id', requireRegistered, errorWrap(teamController.getTeam));

// POST /api/teams
router.post('/', requireAdmin, errorWrap(teamController.createTeam));

// POST /api/teams/many
router.post('/many', requireAdmin, errorWrap(teamController.createTeams));

// PUT /api/teams/many
router.put('/many', requireAdmin, errorWrap(teamController.updateTeams));

// PUT /api/teams/:id
router.put('/:id', requireAdmin, errorWrap(teamController.updateTeam));

export default router;

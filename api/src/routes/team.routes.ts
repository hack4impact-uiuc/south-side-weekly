import { Router } from 'express';

import { errorWrap } from '../middleware';
import { TeamController } from '../controllers';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/teams
router.get('/', requireRegistered, errorWrap(TeamController.getTeams));

// GET /api/teams/:id
router.get('/:id', requireRegistered, errorWrap(TeamController.getTeam));

// POST /api/teams
router.post('/', requireAdmin, errorWrap(TeamController.createTeam));

// POST /api/teams/many
router.post('/many', requireAdmin, errorWrap(TeamController.createTeams));

// PUT /api/teams/many
router.put('/many', requireAdmin, errorWrap(TeamController.updateTeams));

// PUT /api/teams/:id
router.put('/:id', requireAdmin, errorWrap(TeamController.updateTeam));

export default router;

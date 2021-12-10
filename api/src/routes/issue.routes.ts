import { Router } from 'express';

import { errorWrap } from '../middleware';
import { IssueController } from '../controllers';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/issues
router.get('/', requireRegistered, errorWrap(IssueController.getIssues));

// GET /api/issues/:id
router.get('/:id', requireRegistered, errorWrap(IssueController.getIssue));

// GET /api/issues/pitchBuckets/:id
router.get(
  '/pitchBuckets/:id',
  requireAdmin,
  errorWrap(IssueController.getIssueBuckets),
);

// POST /api/issues
router.post('/', requireRegistered, errorWrap(IssueController.createIssue));

// PUT /api/issues/updateIssueStatus/:pitchId
router.put(
  '/updateIssueStatus/:pitchId',
  requireAdmin,
  errorWrap(IssueController.updateIssueStatus),
);

// PUT /api/issues/:id
router.put('/:id', requireAdmin, errorWrap(IssueController.updateIssue));

export default router;

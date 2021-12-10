import { Router } from 'express';

import { errorWrap } from '../middleware';
import * as issueController from '../controllers/issue.controller';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/issues
router.get('/', requireRegistered, errorWrap(issueController.getIssues));

// GET /api/issues/:id
router.get('/:id', requireRegistered, errorWrap(issueController.getIssue));

// GET /api/issues/pitchBuckets/:id
router.get(
  '/pitchBuckets/:id',
  requireAdmin,
  errorWrap(issueController.getIssueBuckets),
);

// POST /api/issues
router.post('/', requireRegistered, errorWrap(issueController.createIssue));

// PUT /api/issues/updateIssueStatus/:pitchId
router.put(
  '/updateIssueStatus/:pitchId',
  requireAdmin,
  errorWrap(issueController.updateIssueStatus),
);

// PUT /api/issues/:id
router.put('/:id', requireAdmin, errorWrap(issueController.updateIssue));

export default router;

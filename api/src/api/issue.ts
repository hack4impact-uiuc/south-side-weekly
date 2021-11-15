import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import Issue from '../models/issue';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = express.Router();

// Gets issue by id
router.get(
  '/:issueId',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found with id',
      });
    } else {
      res.status(200).json({
        success: true,
        result: issue,
        message: `Successfully retrieved issue`,
      });
    }
  }),
);

//Gets all issues
router.get(
  '/',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const issues = await Issue.find({});
    res.status(200).json({
      message: `Successfully retrieved all issues.`,
      success: true,
      result: issues,
    });
  }),
);

// Create a new issue
router.post(
  '/',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const newIssue = await Issue.create(req.body);
    if (newIssue) {
      res.status(200).json({
        message: 'Successfully created new issue',
        success: true,
        result: newIssue,
      });
    }
  }),
);

// Updates a issue
router.put(
  '/:issueId',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.issueId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedIssue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated issue',
      result: updatedIssue,
    });
  }),
);

export default router;
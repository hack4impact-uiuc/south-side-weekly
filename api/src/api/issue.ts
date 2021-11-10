import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import Issue from '../models/issue';
import { requireAdmin, requireRegistered } from '../middleware/auth';
import { IIssue } from 'ssw-common';

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

// Create many new isssues
router.post(
  '/many',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const newIssues: Partial<IIssue>[] = req.body.issues;

    const createdIssues = await Promise.all(
      newIssues.map(async (issue) => Issue.create(issue)),
    );

    const failedIssues = createdIssues.filter((issue) => !issue);

    if (failedIssues.length > 0) {
      const failedIssueNames = failedIssues.map((issue) => issue.name);

      res.status(400).json({
        message: `Failed to create issues: ${failedIssueNames.join(', ')}`,
        success: false,
      });
    }

    res.status(200).json({
      message: 'Successfully created all issues',
      success: true,
      result: createdIssues,
    });
  }),
);

// Update many changed issues
router.put(
  '/update/many',
  requireAdmin,
  errorWrap(async (req: Request, res: Response) => {
    const changedIssues: IIssue[] = req.body.issues;
    const updatedIssues = await Promise.all(
      changedIssues.map(async (issue) => {
        const body = {
          name: issue.name,
          deadlineDate: issue.deadlineDate,
          releaseDate: issue.releaseDate,
          pitches: issue.pitches,
          printIssue: issue.printIssue,
          onlineIssue: issue.onlineIssue,
        };

        return Issue.findByIdAndUpdate(issue._id, body, {
          new: true,
          runValidators: true,
        });
      }),
    );

    const failedIssues = updatedIssues.filter((issue) => !issue);

    if (failedIssues.length > 0) {
      const failedIssueNames = failedIssues.map((issue) => issue.name);

      res.status(400).json({
        message: `Failed to update issues: ${failedIssueNames.join(', ')}`,
        success: false,
      });
    }

    res.status(200).json({
      message: 'Successfully updated all issues',
      success: true,
      result: updatedIssues,
    });
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

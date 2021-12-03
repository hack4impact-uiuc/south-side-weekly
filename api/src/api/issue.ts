import express, { Request, Response } from 'express';
import { errorWrap } from '../middleware';

import Issue from '../models/issue';
import Pitch from '../models/pitch';
import { requireAdmin, requireRegistered } from '../middleware/auth';
import { issueStatusEnum } from '../utils/enums';
import { IPitch } from '../../../common';

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
        message: 'Successfully retrieved issue',
      });
    }
  }),
);

//Gets all issues
router.get(
  '/',
  requireRegistered,
  errorWrap(async (req: Request, res: Response) => {
    const { current, offset } = req.query;

    if (current) {
      const issues = await Issue.find({
        releaseDate: {
          $gte: new Date().toISOString(),
        },
      })
        .sort({ releaseDate: 1 })
        .limit(1)
        .lean();

      res.status(200).json({
        success: true,
        result: issues.length > 0 ? issues[0] : null,
        message: 'Successfully retrieved nearest issue',
      });
    }

    const issues = await Issue.find({});

    res.status(200).json({
      message: 'Successfully retrieved all issues.',
      success: true,
      result: issues,
    });
  }),
);

//Gets all issues
router.get(
  '/pitchBuckets/:issueId',
  errorWrap(async (req: Request, res: Response) => {
    const bucketPitch = (pitch: IPitch, status: string): boolean =>
      pitch.issueStatuses.some(
        ({ issueId, issueStatus }) =>
          issueId.toString() === issue._id.toString() && issueStatus === status,
      );

    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found with id',
      });
    } else {
      const pitches = await Pitch.find({ _id: { $in: issue.pitches } });
      const buckets = [];

      for (const status in issueStatusEnum) {
        const bucket = pitches.filter((pitch) => bucketPitch(pitch, status));
        buckets.push({ status: status, pitches: bucket });
      }

      res.status(200).json({
        success: true,
        result: buckets,
        message: 'Successfully bucketed issues',
      });
    }
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

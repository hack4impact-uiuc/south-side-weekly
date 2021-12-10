import { Request, Response } from 'express';
import { IIssue, IPitch } from 'ssw-common';

import Issue from '../models/issue';
import Pitch from '../models/pitch';
import { sendNotFound, sendSuccess } from '../utils/helpers';
import { issueStatusEnum } from '../utils/enums';

type IdParam = { id: string };

// CREATE controls

type CreateReqBody = Partial<IIssue>;
type CreateReq = Request<IdParam, never, CreateReqBody, never>;

export const createIssue = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const newIssue = await Issue.create(req.body);

  if (newIssue) {
    sendSuccess(res, 'Issue created', newIssue);
  }
};

// READ controls

export const getIssues = async (req: Request, res: Response): Promise<void> => {
  const issues = await Issue.find({});

  sendSuccess(res, 'Issues retrieved', issues);
};

type GetIssueReq = Request<IdParam>;

export const getIssue = async (
  req: GetIssueReq,
  res: Response,
): Promise<void> => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    sendNotFound(res, `Issue with id ${req.params.id} not found`);
    return;
  }
  sendSuccess(res, 'Issue retrieved', issue);
};

type BuildIssueBucketReq = Request<IdParam>;

export const getIssueBuckets = async (
  req: BuildIssueBucketReq,
  res: Response,
): Promise<void> => {
  const issue = await Issue.findById(req.params.id);

  const isPitchInStatusBucket = (pitch: IPitch, issueStatus: string): boolean =>
    pitch.issueStatuses.some(
      (status) =>
        status.issueId.toString() === issue._id.toString() &&
        status.issueStatus === issueStatus,
    );

  if (!issue) {
    sendNotFound(res, `Issue with id ${req.params.id} not found`);
    return;
  }

  const pitches = await Pitch.find({ _id: { $in: issue.pitches } });
  const buckets = [];

  for (const status in issueStatusEnum) {
    const bucket = pitches.filter((pitch) =>
      isPitchInStatusBucket(pitch, status),
    );
    buckets.push({ status: status, pitches: bucket });
  }

  sendSuccess(res, `Issue with id ${req.params.id} buckets retrieved`, buckets);
};

// UPDATE controls

type UpdateReqBody = Partial<IIssue>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updateIssue = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedIssue) {
    sendNotFound(res, `Issue with id ${req.params.id} not found`);
    return;
  }

  sendSuccess(res, 'Issue updated', updatedIssue);
};

type UpdateIssueStatusReqBody = { issueId: string; issueStatus: string };
type UpdateIssueStatusReq = Request<
  { pitchId: string },
  never,
  UpdateIssueStatusReqBody,
  never
>;

export const updateIssueStatus = async (
  req: UpdateIssueStatusReq,
  res: Response,
): Promise<void> => {
  const { issueId, issueStatus } = req.body;

  await Pitch.findByIdAndUpdate(req.params.pitchId, {
    $pull: {
      issueStatuses: { issueId: issueId },
    },
  });

  const updatePitch = await Pitch.findByIdAndUpdate(
    req.params.pitchId,
    {
      $addToSet: {
        issueStatuses: { issueId, issueStatus },
      },
    },
    { new: true },
  );

  if (!updatePitch) {
    sendNotFound(res, `Pitch with id ${req.params.pitchId} not found`);
    return;
  }

  sendSuccess(res, 'Issue status updated', updatePitch);
};

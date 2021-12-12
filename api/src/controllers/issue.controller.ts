import { Request, Response } from 'express';
import { IIssue } from 'ssw-common';

import Issue from '../models/issue';
import { sendNotFound, sendSuccess } from '../utils/helpers';
import { IssueService, PitchService } from '../services';

type IdParam = { id: string };

// CREATE controls

type CreateReqBody = Partial<IIssue>;
type CreateReq = Request<IdParam, never, CreateReqBody, never>;

export const createIssue = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const newIssue = await IssueService.add(req.body);

  if (newIssue) {
    sendSuccess(res, 'Issue created', newIssue);
  }
};

// READ controls

export const getIssues = async (req: Request, res: Response): Promise<void> => {
  const issues = await IssueService.getAll();

  sendSuccess(res, 'Issues retrieved', issues);
};

type GetIssueReq = Request<IdParam>;

export const getIssue = async (
  req: GetIssueReq,
  res: Response,
): Promise<void> => {
  const issue = await IssueService.getOne(req.params.id);

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

  if (!issue) {
    sendNotFound(res, `Issue with id ${req.params.id} not found`);
    return;
  }

  const buckets = await IssueService.getPitchBuckets(issue);

  sendSuccess(res, `Issue with id ${req.params.id} buckets retrieved`, buckets);
};

// UPDATE controls

type UpdateReqBody = Partial<IIssue>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updateIssue = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const updatedIssue = await IssueService.update(req.params.id, req.body);

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

  const pitch = PitchService.changeIssueStatus(
    req.params.pitchId,
    issueId,
    issueStatus,
  );

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.pitchId} not found`);
    return;
  }

  sendSuccess(res, 'Issue status updated', pitch);
};

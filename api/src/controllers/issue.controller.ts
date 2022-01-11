import { Request, Response } from 'express';
import { IIssue } from 'ssw-common';

import Issue from '../models/issue.model';
import { sendNotFound, sendSuccess } from '../utils/helpers';
import { IssueService, PitchService } from '../services';
import { extractOptions, extractPopulateQuery } from './utils';
import { populateIssue, populatePitch } from '../populators';

type IdParam = { id: string };

// CREATE controls

type CreateReqBody = Partial<IIssue>;
type CreateReq = Request<IdParam, never, CreateReqBody, never>;

export const createIssue = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const newIssue = await IssueService.add(req.body);
  const populateType = extractPopulateQuery(req.query);

  if (newIssue) {
    sendSuccess(
      res,
      'Issue created',
      await populateIssue(newIssue, populateType),
    );
  }
};

// READ controls

export const getIssues = async (req: Request, res: Response): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const issues = await IssueService.getAll(options);

  sendSuccess(res, 'Issues retrieved', {
    data: await populateIssue(issues.data, populateType),
    count: issues.count,
  });
};

type GetIssueReq = Request<IdParam>;

export const getIssue = async (
  req: GetIssueReq,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);

  const issue = await IssueService.getOne(req.params.id);

  if (!issue) {
    sendNotFound(res, `Issue with id ${req.params.id} not found`);
    return;
  }

  sendSuccess(res, 'Issue retrieved', await populateIssue(issue, populateType));
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
  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Issue updated',
    await populateIssue(updatedIssue, populateType),
  );
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
  const populateType = extractPopulateQuery(req.query);

  const pitch = await PitchService.changeIssueStatus(
    req.params.pitchId,
    issueId,
    issueStatus,
  );

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.pitchId} not found`);
    return;
  }

  sendSuccess(
    res,
    'Issue status updated',
    await populatePitch(pitch, populateType),
  );
};

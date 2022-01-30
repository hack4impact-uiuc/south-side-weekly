import { Request, Response } from 'express';
import { BasePopulatedPitch, Pitch } from 'ssw-common';

import { populatePitch } from '../populators';
import { PitchService, TeamService, UserService } from '../services';
import { isWriterOrEditor } from '../services/pitch.service';
import { editorTypeEnum, pitchStatusEnum } from '../utils/enums';
import { sendFail, sendNotFound, sendSuccess } from '../utils/helpers';
import { extractOptions, extractPopulateQuery } from './utils';

type IdParam = { id?: string };

// CREATE controls

type CreateReqQuery = Partial<Pitch>;
type CreateReq = Request<never, never, CreateReqQuery>;

export const createPitch = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const newPitch = await PitchService.add(req.body);

  if (newPitch) {
    sendSuccess(res, 'Pitch created successfully', newPitch);
  }
};

// READ controls

export const getPitches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getAll(options);

  sendSuccess(res, 'Pitches retrieved successfully', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

type GetPitchesReq = Request<IdParam>;

export const getPitch = async (
  req: GetPitchesReq,
  res: Response,
): Promise<void> => {
  const pitch = await PitchService.getOne(req.params.id);

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Pitch retrieved successfully',
    await populatePitch(pitch, populateType),
  );
};

export const getPendingPitches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getPendingPitches(options);

  sendSuccess(res, 'Pitches retrieved successfully', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

type GetApprovedPitchesReqQuery = { status: string };
type GetApprovedPitchesReq = Request<never, never, GetApprovedPitchesReqQuery>;

export const getApprovedPitches = async (
  req: GetApprovedPitchesReq,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getApprovedPitches(options);

  sendSuccess(res, 'Successfully retrieved all approved pitches', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

export const getPitchesWithPendingClaims = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getPendingClaimPitches(options);

  sendSuccess(res, 'Pitches retrieved successfully', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

export const getClaimablePitches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.params.userId;

  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getClaimablePitches(userId, options);

  sendSuccess(res, 'Pitches retrieved successfully', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

export const getClaimRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.params.userId;

  const populateType = extractPopulateQuery(req.query);
  const options = extractOptions(req.query);

  const pitches = await PitchService.getClaimRequests(userId, options);

  sendSuccess(res, 'Pitches retrieved successfully', {
    data: await populatePitch(pitches.data, populateType),
    count: pitches.count,
  });
};

// UPDATE controls

type UpdateReqBody = Partial<Pitch>;
type UpdateReq = Request<IdParam, never, UpdateReqBody, never>;

export const updatePitch = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const updatedPitch = await PitchService.update(req.params.id, req.body);

  if (!updatedPitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Pitch updated successfully',
    await populatePitch(updatedPitch, populateType),
  );
};

export const approvePitch = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const currentPitch = await PitchService.getOne(req.params.id);

  if (!currentPitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  } else if (currentPitch.status !== pitchStatusEnum.PENDING) {
    sendFail(res, 'Pitch is not pending approval');
    return;
  }

  const pitch = await PitchService.approvePitch(
    req.params.id,
    req.user._id,
    req.body,
  );
  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  sendSuccess(res, 'Pitch approved successfully', pitch);
};

type DeclineReqBody = {
  reasoning: string;
};
type DeclineReq = Request<IdParam, never, DeclineReqBody, never>;

export const declinePitch = async (
  req: DeclineReq,
  res: Response,
): Promise<void> => {
  const currentPitch = await PitchService.getOne(req.params.id);

  if (!currentPitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  } else if (currentPitch.status !== pitchStatusEnum.PENDING) {
    sendFail(res, 'Pitch is not pending approval');
    return;
  }

  const pitch = await PitchService.declinePitch(req.params.id, req.user._id);

  const populatedPitch = (await populatePitch(
    pitch,
    'default',
  )) as BasePopulatedPitch;

  sendSuccess(res, 'Pitch declined successfully', populatedPitch);
};

type SubmitClaimReqBody = { userId: string; teams: string[]; message: string };
type SubmitClaimReq = Request<IdParam, never, SubmitClaimReqBody, never>;

export const submitClaim = async (
  req: SubmitClaimReq,
  res: Response,
): Promise<void> => {
  if (!UserService.isValidId(req.body.userId)) {
    sendNotFound(res, `User with id ${req.body.userId} not found`);
    return;
  }

  const updatedPitch = await PitchService.submitClaim(
    req.params.id,
    req.body.userId,
    req.body.teams,
    req.body.message,
  );

  await UserService.addClaimRequest(req.body.userId, req.params.id);

  if (!updatedPitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Claim submitted successfully',
    await populatePitch(updatedPitch, populateType),
  );
};

type ApproveClaimReqBody = { userId: string; teams: string[]; teamId: string };
type ApproveClaimReq = Request<IdParam, never, ApproveClaimReqBody, any>;

export const approveClaimRequest = async (
  req: ApproveClaimReq,
  res: Response,
): Promise<void> => {
  const { userId, teamId } = req.body;
  const { writer, editor } = req.query;

  const isPendingContributor = await PitchService.isPendingContributor(
    req.params.id,
    userId,
    teamId,
  );

  if (!isPendingContributor) {
    sendFail(res, 'User is not pending contributor');
    return;
  }

  const team = await TeamService.getOne(teamId);
  if (!team) {
    sendNotFound(res, `Team with id ${teamId} not found`);
    return;
  }

  let pitch = await PitchService.removeTeamFromPendingContributors(
    req.params.id,
    userId,
    teamId,
  );

  pitch = await PitchService.addContributor(
    req.params.id,
    userId,
    teamId,
    editor,
    writer,
  );

  if (!isWriterOrEditor(writer, editor)) {
    pitch = await PitchService.decrementTeamTarget(req.params.id, teamId);
  }

  const user = await UserService.receiveClaimRequestApproval(
    userId,
    req.params.id,
  );

  if (!user) {
    sendNotFound(res, `User with id ${userId} not found`);
    return;
  } else if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const defaultPopulatedPitch = (await populatePitch(
    pitch,
    'default',
  )) as BasePopulatedPitch;

  sendSuccess(res, 'Claim approved successfully', defaultPopulatedPitch);
};

type DeclineClaimReqBody = { userId: string; teamId: string };
type DeclineClaimReq = Request<IdParam, never, DeclineClaimReqBody, never>;

export const declineClaimRequest = async (
  req: DeclineClaimReq,
  res: Response,
): Promise<void> => {
  const { userId, teamId } = req.body;

  const isPendingContributor = await PitchService.isPendingContributor(
    req.params.id,
    userId,
    teamId,
  );

  if (!isPendingContributor) {
    sendFail(res, 'User is not pending contributor');
    return;
  }

  if (!userId) {
    sendFail(res, 'User id is required');
    return;
  }

  const pitch = await PitchService.removeTeamFromPendingContributors(
    req.params.id,
    userId,
    teamId,
  );

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const user = await UserService.removeClaimRequest(userId, req.params.id);

  if (!user) {
    sendNotFound(res, `User with id ${userId} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Claim declined successfully',
    await populatePitch(pitch, populateType),
  );
};

type UpdateTeamTargetBody = { teamId: string; target: number };
type UpdateTeamTargetReq = Request<IdParam, never, UpdateTeamTargetBody, never>;

export const updateTeamTarget = async (
  req: UpdateTeamTargetReq,
  res: Response,
): Promise<void> => {
  const { teamId, target } = req.body;

  const pitch = await PitchService.updateTeamTarget(
    req.params.id,
    teamId,
    target,
  );

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Successfully updated pitch team target',
    await populatePitch(pitch, populateType),
  );
};

type ChangeEditorQuery = { from: string; to: string };
type ChangeEditorBody = { userId: string };
type ChangeEditorReq = Request<
  IdParam,
  never,
  ChangeEditorBody,
  ChangeEditorQuery
>;

export const changeEditor = async (
  req: ChangeEditorReq,
  res: Response,
): Promise<void> => {
  const { userId } = req.body;

  const pitch = await PitchService.changeEditor(
    req.params.id,
    userId,
    req.query.from,
    req.query.to,
  );

  if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Successfully changed editor',
    await populatePitch(pitch, populateType),
  );
};

/* type AddContributorQuery = {
  editor: 'First' | 'Seconds' | 'Thirds' | undefined;
  writer: boolean;
}; */
type AddContributorBody = { userId: string; teamId: string };
type AddContributorReq = Request<IdParam, never, AddContributorBody, any>;

export const addContributor = async (
  req: AddContributorReq,
  res: Response,
): Promise<void> => {
  const { userId, teamId } = req.body;
  const { editor, writer } = req.query;

  const currentPitch = await PitchService.getOne(req.params.id);

  const canAddContributor = async (): Promise<[boolean, string]> => {
    if (writer === 'true') {
      if (currentPitch.writer && currentPitch.writer.toString() === userId) {
        return [false, 'User is already a writer'];
      }

      return [true, ''];
    } else if (editor === editorTypeEnum.PRIMARY) {
      if (currentPitch.primaryEditor.toString() === userId) {
        return [false, 'User is already a primary editor'];
      }

      return [true, ''];
    } else if (editor === editorTypeEnum.SECONDS) {
      if (
        currentPitch.secondEditors.some(
          (editor) => editor.toString() === userId,
        )
      ) {
        return [false, 'User is already a secondary editor'];
      }

      return [true, ''];
    } else if (editor === editorTypeEnum.THIRDS) {
      if (
        currentPitch.thirdEditors.some((editor) => editor.toString() === userId)
      ) {
        return [false, 'User is already a third editor'];
      }

      return [true, ''];
    } else if (
      await PitchService.isContributor(req.params.id, userId, teamId)
    ) {
      return [false, 'User is already a contributor'];
    }

    return [true, ''];
  };

  const [canAdd, error] = await canAddContributor();

  if (!canAdd) {
    sendFail(res, error);
    return;
  }

  let pitch = await PitchService.addContributor(
    req.params.id,
    userId,
    teamId,
    editor,
    writer,
  );

  if (!isWriterOrEditor(writer, editor)) {
    pitch = await PitchService.decrementTeamTarget(req.params.id, teamId);
  }

  const user = await UserService.receiveClaimRequestApproval(
    userId,
    req.params.id,
  );

  if (!user) {
    sendNotFound(res, `User with id ${userId} not found`);
    return;
  } else if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  sendSuccess(res, 'Successfully added contributor', pitch);
};

/* type RemoveContributorQuery = {
  editor: 'First' | 'Seconds' | 'Thirds' | undefined;
  writer: boolean;
}; */
type RemoveContributorBody = { userId: string; teamId: string };
type RemoveContributorReq = Request<IdParam, never, RemoveContributorBody, any>;

export const removeContributor = async (
  req: RemoveContributorReq,
  res: Response,
): Promise<void> => {
  const { userId, teamId } = req.body;
  const { editor, writer } = req.query;

  const currentPitch = await PitchService.getOne(req.params.id);

  const canRemoveContributor = async (): Promise<[boolean, string]> => {
    if (writer === 'true') {
      if (currentPitch.writer && currentPitch.writer.toString() !== userId) {
        return [false, 'User is not the writer'];
      }

      return [true, ''];
    } else if (editor === editorTypeEnum.PRIMARY) {
      if (currentPitch.primaryEditor.toString() !== userId) {
        return [false, 'User is not the primary editor'];
      }

      return [true, ''];
    } else if (editor === editorTypeEnum.SECONDS) {
      if (
        currentPitch.secondEditors.every(
          (editor) => editor.toString() !== userId,
        )
      ) {
        return [false, 'User is not a secondary editor'];
      }

      return [true, ''];
    } else if (editor === editorTypeEnum.THIRDS) {
      if (
        currentPitch.thirdEditors.every(
          (editor) => editor.toString() !== userId,
        )
      ) {
        return [false, 'User is not a third editor'];
      }

      return [true, ''];
    } else if (
      !(await PitchService.isContributor(req.params.id, userId, teamId))
    ) {
      return [false, 'User is not a contributor'];
    }

    return [true, ''];
  };

  const [canRemove, error] = await canRemoveContributor();

  if (!canRemove) {
    sendFail(res, error);
    return;
  }

  let pitch = await PitchService.removeContributor(
    req.params.id,
    userId,
    teamId,
    editor,
    writer,
  );

  if (!isWriterOrEditor(writer, editor)) {
    pitch = await PitchService.incrementTeamTarget(req.params.id, teamId);
  }

  const user = await UserService.removeClaimedPitch(userId, req.params.id);

  if (!user) {
    sendNotFound(res, `User with id ${userId} not found`);
    return;
  } else if (!pitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Successfully removed contributor',
    await populatePitch(pitch, populateType),
  );
};

// DELETE controls

type DeletePitchReq = Request<IdParam>;

export const deletePitch = async (
  req: DeletePitchReq,
  res: Response,
): Promise<void> => {
  const deletedPitch = await PitchService.remove(req.params.id);

  if (!deletedPitch) {
    sendNotFound(res, `Pitch with id ${req.params.id} not found`);
    return;
  }

  const populateType = extractPopulateQuery(req.query);

  sendSuccess(
    res,
    'Pitch deleted successfully',
    await populatePitch(deletedPitch, populateType),
  );
};

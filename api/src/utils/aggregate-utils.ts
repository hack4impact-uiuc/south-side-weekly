import {
  IPitch,
  IUser,
  IUserAggregate,
  IPitchAggregate,
  IIssue,
} from 'ssw-common';

import Pitch from '../models/pitch';
import User from '../models/user';
import Team from '../models/team';
import Interest from '../models/interest';
import Issue from '../models/issue';

const simplifyUser = (user: IUser | null): Partial<IUser> => {
  if (user === null) {
    return null;
  }

  return {
    firstName: user.firstName,
    preferredName: user.preferredName,
    lastName: user.lastName,
    email: user.email,
    profilePic: user.profilePic,
    _id: user._id,
  };
};

const simplifyIssue = (issue: IIssue | null): IIssue => {
  if (issue === null) {
    return null;
  }

  return {
    _id: issue._id,
    name: issue.name,
    deadlineDate: issue.deadlineDate,
    releaseDate: issue.releaseDate,
    pitches: issue.pitches,
    type: issue.type,
  };
};

const aggregatePitch = async (rawPitch: IPitch): Promise<IPitchAggregate> => {
  const author = simplifyUser(await User.findById(rawPitch.author));
  const reviewer = simplifyUser(await User.findById(rawPitch.reviewedBy));
  const writer = simplifyUser(await User.findById(rawPitch.writer));
  const primaryEditor = simplifyUser(
    await User.findById(rawPitch.primaryEditor),
  );
  const secondEditors = await Promise.all(
    rawPitch.secondEditors.map(async (editorId) =>
      simplifyUser(await User.findById(editorId)),
    ),
  );

  const thirdEditors = await Promise.all(
    rawPitch.thirdEditors.map(async (editorId) =>
      simplifyUser(await User.findById(editorId)),
    ),
  );
  const assignmentContributors = await Promise.all(
    rawPitch.assignmentContributors.map(async (contributor) => ({
      user: simplifyUser(await User.findById(contributor.userId)),
      teams: contributor.teams,
    })),
  );

  const pendingContributors = await Promise.all(
    rawPitch.pendingContributors.map(async (contributor) => ({
      user: simplifyUser(await User.findById(contributor.userId)),
      teams: contributor.teams,
    })),
  );

  const interests = await Promise.all(
    rawPitch.topics.map((interestId) => Interest.findById(interestId).lean()),
  );

  const teams = await Promise.all(
    rawPitch.teams.map(({ teamId, target }) =>
      Team.findById(teamId)
        .lean()
        .then((team) => ({ target, ...team })),
    ),
  );

  const issues = await Promise.all(
    rawPitch.issues.map(async (issueId) =>
      simplifyIssue(await Issue.findById(issueId)),
    ),
  );

  const aggregatedPitch = {
    ...rawPitch,
    aggregated: {
      author: author,
      writer: writer,
      reviewedBy: reviewer,
      assignmentContributors: assignmentContributors,
      pendingContributors: pendingContributors,
      interests: interests,
      teams: teams,
      primaryEditor: primaryEditor,
      secondaryEditors: secondEditors,
      thirdEditors: thirdEditors,
      issues: issues,
    },
  };

  return aggregatedPitch;
};

const simplifyPitch = (pitch: IPitch | null): Partial<IPitch> => {
  if (pitch === null) {
    return null;
  }
  return {
    _id: pitch._id,
    title: pitch.title,
    description: pitch.description,
    author: pitch.author,
    createdAt: pitch.createdAt,
    teams: pitch.teams,
    topics: pitch.topics,
    assignmentContributors: pitch.assignmentContributors,
    pendingContributors: pitch.pendingContributors,
    status: pitch.status,
    deadline: pitch.deadline,
    issueStatuses: pitch.issueStatuses,
  };
};

const aggregateUser = async (rawUser: IUser): Promise<IUserAggregate> => {
  const claimedPitches = await Promise.all(
    rawUser.claimedPitches.map(
      async (id) =>
        await aggregatePitch((await Pitch.findById(id).lean()) as IPitch),
    ),
  );

  const submittedPitches = await Promise.all(
    rawUser.submittedPitches.map(async (id) =>
      simplifyPitch(await Pitch.findById(id)),
    ),
  );

  const submittedClaims = await Promise.all(
    rawUser.submittedClaims.map(async (id) =>
      simplifyPitch(await Pitch.findById(id)),
    ),
  );

  const interests = await Promise.all(
    rawUser.interests.map((interestId) => Interest.findById(interestId).lean()),
  );

  const aggregatedUser = {
    ...rawUser,
    aggregated: {
      claimedPitches: claimedPitches,
      submittedPitches: submittedPitches,
      submittedClaims: submittedClaims,
      interests: interests,
    },
  };

  return aggregatedUser;
};

export { aggregatePitch, aggregateUser };

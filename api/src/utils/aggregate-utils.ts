import { IPitch, IUser, IUserAggregate, IPitchAggregate } from 'ssw-common';

import Pitch from '../models/pitch';
import User from '../models/user';
import Team from '../models/team';
import Interest from '../models/interest';

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
    },
  };

  return aggregatedPitch;
};

const simplifyPitch = (pitch: IPitch | null): Partial<IPitch> => {
  if (pitch === null) {
    return null;
  }

  return {
    title: pitch.title,
    description: pitch.description,
    author: pitch.author,
  };
};

const aggregateUser = async (rawUser: IUser): Promise<IUserAggregate> => {
  const claimedPitches = await Promise.all(
    rawUser.claimedPitches.map(async (id) =>
      simplifyPitch(await Pitch.findById(id)),
    ),
  );

  const submittedPitches = await Promise.all(
    rawUser.submittedPitches.map(async (id) =>
      simplifyPitch(await Pitch.findById(id)),
    ),
  );

  const interests = await Promise.all(
    rawUser.interests.map((interestId) => Interest.findById(interestId).lean()),
  );

  const aggregatedPitch = {
    ...rawUser,
    aggregated: {
      claimedPitches: claimedPitches,
      submittedPitches: submittedPitches,
      interests: interests,
    },
  };

  return aggregatedPitch;
};

export { aggregatePitch, aggregateUser };

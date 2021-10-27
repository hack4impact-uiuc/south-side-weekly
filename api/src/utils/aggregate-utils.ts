import { IPitch, IUser, IUserAggregate, IPitchAggregate } from 'ssw-common';

import Pitch from '../models/pitch';
import User from '../models/user';
import Team from '../models/team';

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
      reviewedBy: reviewer,
      assignmentContributors: assignmentContributors,
      pendingContributors: pendingContributors,
      teams: teams,
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

  const aggregatedPitch = {
    ...rawUser,
    aggregated: {
      claimedPitches: claimedPitches,
      submittedPitches: submittedPitches,
    },
  };

  return aggregatedPitch;
};

export { aggregatePitch, aggregateUser };

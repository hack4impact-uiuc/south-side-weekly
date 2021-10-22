import { IPitch, IUser, IUserAggregate, IPitchAggregate } from 'ssw-common';

import Pitch, { PitchSchema } from '../models/pitch';
import User, { UserSchema } from '../models/user';

import { santitizePitch, santitizeUser } from './helpers';

const simplifyUser = (user: IUser): Partial<IUser> => ({
  firstName: user ? user.firstName : '',
  preferredName: user ? user.preferredName : '',
  lastName: user ? user.lastName : '',
  profilePic: user ? user.profilePic: '',
  _id: user ? user._id: '',
});

const aggregatePitch = async (
  rawPitch: PitchSchema,
): Promise<IPitchAggregate> => {
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

  const aggregatedPitch = {
    ...santitizePitch(rawPitch),
    aggregated: {
      author: author,
      reviewedBy: reviewer,
      assignmentContributors: assignmentContributors,
      pendingContributors: pendingContributors,
    },
  };

  return aggregatedPitch;
};

const simplifyPitch = (pitch: IPitch): Partial<IPitch> => ({
  title: pitch.title,
  description: pitch.description,
  author: pitch.author,
});

const aggregateUser = async (rawUser: UserSchema): Promise<IUserAggregate> => {
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
    ...santitizeUser(rawUser),
    aggregated: {
      claimedPitches: claimedPitches,
      submittedPitches: submittedPitches,
    },
  };

  return aggregatedPitch;
};

export { aggregatePitch, aggregateUser };

import { IPitch, IUser, IUserAggregate, IPitchAggregate } from 'ssw-common';

import Pitch, { PitchSchema } from '../models/pitch';
import User, { UserSchema } from '../models/user';

import { santitizePitch, santitizeUser } from './helpers';

const simplifyUser = (user: IUser): Partial<IUser> => ({
  firstName: user.firstName,
  preferredName: user.preferredName,
  lastName: user.lastName,
  profilePic: user.profilePic,
  _id: user._id,
});

const aggregatePitch = async (
  rawPitch: PitchSchema,
): Promise<IPitchAggregate> => {
  const author = simplifyUser(await User.findById(rawPitch.author));
  const reviewer = simplifyUser(await User.findById(rawPitch.reviewedBy));
  const primaryEditor = simplifyUser(
    await User.findById(rawPitch.primaryEditor),
  );
  const secondEditors = await Promise.all(
    rawPitch.secondEditors.map(async (editorId) => {
      simplifyUser(await User.findById(editorId));
    }),
  );

  const thirdEditors = await Promise.all(
    rawPitch.thirdEditors.map(async (editorId) => {
      simplifyUser(await User.findById(editorId));
    }),
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

  const aggregatedPitch = {
    ...santitizePitch(rawPitch),
    aggregated: {
      author: author,
      reviewedBy: reviewer,
      assignmentContributors: assignmentContributors,
      pendingContributors: pendingContributors,
      primaryEditor: primaryEditor,
      secondaryEditors: secondEditors,
      thirdEditors: thirdEditors,
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

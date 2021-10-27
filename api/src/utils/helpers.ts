import { IPitch, IUser } from 'ssw-common';
import { PitchSchema } from '../models/pitch';
import { UserSchema } from '../models/user';

export const isPitchClaimed = (pitch: IPitch): boolean =>
  getOpenTeamsForPitch(pitch).length === 0;

export const getOpenTeamsForPitch = (pitch: IPitch): IPitch['teams'] => {
  let openTeams: IPitch['teams'] = [];
  if (pitch.teams !== null && pitch.teams.length !== undefined) {
    openTeams = pitch.teams.filter((team) => team.target > 0);
  }
  return openTeams;
};

export const updatePitchTeamTargets = (
  pitch: IPitch,
  teams: string[],
): void => {
  for (const teamId of teams) {
    const team = pitch.teams.find(
      ({ teamId: pitchTeamId }) => pitchTeamId === teamId,
    );

    team.target--;
  }
};

export const santitizePitch = (pitch: PitchSchema): IPitch => ({
  _id: pitch._id,
  title: pitch.title,
  author: pitch.author,
  description: pitch.description,
  status: pitch.status,
  assignmentStatus: pitch.assignmentStatus,
  assignmentGoogleDocLink: pitch.assignmentGoogleDocLink,
  assignmentContributors: pitch.assignmentContributors,
  pendingContributors: pitch.pendingContributors,
  topics: pitch.topics,
  teams: pitch.teams,
  reviewedBy: pitch.reviewedBy,
  similarStories: pitch.similarStories,
  deadline: pitch.deadline,
  conflictOfInterest: pitch.conflictOfInterest,
});

export const santitizeUser = (user: UserSchema): IUser => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  preferredName: user.preferredName,
  email: user.email,
  phone: user.phone,
  oauthID: user.oauthID,
  genders: user.genders,
  pronouns: user.pronouns,
  dateJoined: user.dateJoined,
  masthead: user.masthead,
  onboardingStatus: user.onboardingStatus,
  visitedPages: user.visitedPages,
  profilePic: user.profilePic,
  portfolio: user.portfolio,
  linkedIn: user.linkedIn,
  twitter: user.twitter,
  involvementResponse: user.involvementResponse,
  claimedPitches: user.claimedPitches,
  submittedPitches: user.submittedPitches,
  teams: user.teams,
  role: user.role,
  hasRoleApproved: user.hasRoleApproved,
  races: user.races,
  interests: user.interests,
});

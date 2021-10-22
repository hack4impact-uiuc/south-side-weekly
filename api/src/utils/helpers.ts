import { IPitch, IUser } from 'ssw-common';
import { PitchSchema } from '../models/pitch';
import { UserSchema } from '../models/user';

export const isPitchClaimed = (pitch: IPitch): boolean =>
  Object.entries(pitch.teams).every(
    (team) => team[1].current === team[1].target,
  );

export const santitizePitch = (pitch: PitchSchema): IPitch => ({
  _id: pitch._id,
  title: pitch.title,
  author: pitch.author,
  primaryEditor: pitch.primaryEditor,
  secondEditors: pitch.secondEditors,
  thirdEditors: pitch.thirdEditors,
  writer: pitch.writer,
  issues: pitch.issues,
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
  profilePic: user.profilePic,
  portfolio: user.portfolio,
  linkedIn: user.linkedIn,
  twitter: user.twitter,
  involvementResponse: user.involvementResponse,
  claimedPitches: user.claimedPitches,
  submittedPitches: user.submittedPitches,
  currentTeams: user.currentTeams,
  role: user.role,
  hasRoleApproved: user.hasRoleApproved,
  races: user.races,
  interests: user.interests,
});

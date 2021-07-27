import { IPitch } from '../types';
export interface SessionUser {
  _id: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  profilePic: string;
  email: string;
  phone: string;
  gender: [string];
  pronouns: [string];
  dateJoined: Date;
  masthead: boolean;
  onboarding: string;
  portfolio: string;
  linkedIn: string;
  twitter: string;
  claimedPitches: [IPitch];
  submittedPitches: [IPitch];
  currentTeams: [string];
  role: string;
  races: [string];
  interests: [string];
}

export const sessionizeUser = (user: SessionUser): SessionUser => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  preferredName: user.preferredName,
  profilePic: user.profilePic,
  email: user.email,
  phone: user.phone,
  gender: user.gender,
  pronouns: user.pronouns,
  dateJoined: user.dateJoined,
  masthead: user.masthead,
  onboarding: user.onboarding,
  portfolio: user.portfolio,
  linkedIn: user.linkedIn,
  twitter: user.twitter,
  claimedPitches: user.claimedPitches,
  submittedPitches: user.submittedPitches,
  currentTeams: user.currentTeams,
  role: user.role,
  races: user.races,
  interests: user.interests,
});

export const isPitchClaimed = (pitch: IPitch): boolean =>
  Object.entries(pitch.teams).every(
    (team) => team[1].current === team[1].target,
  );

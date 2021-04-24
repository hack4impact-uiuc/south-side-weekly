import { IPitch } from '../types/index';
export interface SessionUser {
  _id: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  gender: [string];
  pronouns: [string];
  dateJoined: Date;
  masthead: boolean;
  onboarding: string;
  portfolio: string;
  profilePic: string;
  linkedIn: string;
  twitter: string;
  reasonForInvolvement: string;
  claimedPitches: [IPitch];
  submittedPitches: [IPitch];
  currentTeams: [string];
  role: string;
  races: [string];
  interests: [string];
}

export const sessionizeUser = (user: IUser): SessionUser => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  preferredName: user.preferredName,
  email: user.email,
  phone: user.phone,
  gender: user.genders,
  pronouns: user.pronouns,
  dateJoined: user.dateJoined,
  masthead: user.masthead,
  onboarding: user.onboarding,
  portfolio: user.portfolio,
  profilePic: user.profilePic,
  linkedIn: user.linkedIn,
  twitter: user.twitter,
  reasonForInvolvement: user.reasonForInvolvement,
  claimedPitches: user.claimedPitches,
  submittedPitches: user.submittedPitches,
  currentTeams: user.currentTeams,
  role: user.role,
  races: user.races,
  interests: user.interests,
});

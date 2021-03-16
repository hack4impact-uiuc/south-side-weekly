/**
 * Interface for a User Schema.
 */
export interface IUser {
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  oauthID: string;
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

/**
 * Interface for a Pitch Schema.
 */
export interface IPitch {
  name: string;
  // pitchAuthor: mongoose.Types.ObjectId;
  pitchStatus: string;
  assignmentStatus: string;
  assignmentGoogleDocLink: string;
  assignmentContributors: [IUser];
  topics: [string];
  currentWriters: number;
  targetWriters: number;
  currentEditors: number;
  targetEditors: number;
  currentData: number;
  targetData: number;
  currentVisuals: number;
  targetVisuals: number;
  currentIllustration: number;
  targetIllustration: number;
  currentPhotography: number;
  targetPhotography: number;
  currentFactChecking: number;
  targetFactChecking: number;
  currentRadio: number;
  targetRadio: number;
  currentLayout: number;
  targetLayout: number;
  approvedBy: IUser;
  similarStories: [string];
  deadline: Date;
}
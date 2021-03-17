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
  topic: string;
  teams: ITeams;
  approvedBy: IUser;
  similarStories: [string];
  deadline: Date;
}

export interface IStats {
  current: number;
  target: number;
}

export interface ITeams {
  writers: IStats;
  editors: IStats;
  data: IStats;
  visuals: IStats;
  illustration: IStats;
  photography: IStats;
  factChecking: IStats;
  radio: IStats;
  layout: IStats;
}
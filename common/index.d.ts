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
  teams: {
    writers: {
      current: number;
      target: number;
    };
    editors: {
      current: number;
      target: number;
    };
    factChecking: {
      current: number;
      target: number;
    };
    visuals: {
      current: number;
      target: number;
    };
    photography: {
      current: number;
      target: number;
    };
    illustration: {
      current: number;
      target: number;
    };
  };
  approvedBy: IUser;
  similarStories: [string];
  deadline: Date;
}

/**
 * Interface for a User Schema.
 */
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  oauthID: string;
  genders: [string];
  pronouns: [string];
  dateJoined: Date;
  masthead: boolean;
  onboarding: string;
  profilePic: string;
  portfolio: string;
  linkedIn: string;
  twitter: string;
  claimedPitches: [string];
  submittedPitches: [string];
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
  _id: string;
  pitchAuthor: string;
  pitchDescription: string;
  pitchStatus: string;
  assignmentStatus: string;
  assignmentGoogleDocLink: string;
  assignmentContributors: [string];
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
  approvedBy: string;
  similarStories: [string];
  deadline: Date;
}

/**
 * Interface for a Resource Schema.
 */
export interface IResource {
  name: string;
  link: string;
  teamRoles: [string];
  _id: string;
}
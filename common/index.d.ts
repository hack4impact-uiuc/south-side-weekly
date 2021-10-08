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
  genders: string[];
  pronouns: string[];
  dateJoined: Date;
  masthead: boolean;
  onboardingStatus: string;
  profilePic: string;
  portfolio: string;
  linkedIn: string;
  twitter: string;
  involvementResponse: string;
  claimedPitches: string[];
  submittedPitches: string[];
  currentTeams: string[];
  role: string;
  hasRoleApproved: boolean;
  races: string[];
  interests: string[];
}

/**
 * Interface for a Pitch Schema.
 */
export interface IPitch {
  _id: string;
  title: string;
  author: string;
  description: string;
  status: string;
  assignmentStatus: string;
  assignmentGoogleDocLink: string;
  assignmentContributors: string[];
  pendingContributors: string[];
  topics: string[];
  teams: Map<string, number>;
  approvedBy: string;
  similarStories: string[];
  deadline: Date;
  conflictOfInterest: boolean;
}

/**
 * Interface for a Resource Schema.
 */
export interface IResource {
  name: string;
  link: string;
  teamRoles: string[];
  _id: string;
}

/**
 * Interface for a Team Schema.
 */
export interface ITeam {
  _id: string;
  name: string;
  active: boolean;
  color: string;
}

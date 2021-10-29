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
  visitedPages: string[];
  profilePic: string;
  portfolio: string;
  linkedIn: string;
  twitter: string;
  involvementResponse: string;
  claimedPitches: string[];
  submittedPitches: string[];
  teams: string[];
  role: string;
  hasRoleApproved: boolean;
  races: string[];
  interests: string[];
}

export interface IUserAggregate extends IUser {
  aggregated: {
    claimedPitches: Partial<IPitch>[];
    submittedPitches: Partial<IPitch>[];
  };
}

/**
 * Interface for a Pitch Schema.
 */
export interface IPitch {
  _id: string;
  title: string;
  issues: { issueFormat: string; issueDate: Date }[];
  author: string;
  writer: string;
  primaryEditor: string;
  secondEditors: string[];
  thirdEditors: string[];
  description: string;
  status: string;
  assignmentStatus: string;
  assignmentGoogleDocLink: string;
  assignmentContributors: { userId: string; teams: string[] }[];
  pendingContributors: { userId: string; teams: string[] }[];
  topics: string[];
  teams: {
    teamId: string;
    target: number;
  }[];
  reviewedBy: string;
  similarStories: string[];
  deadline: Date;
  conflictOfInterest: boolean;
}

export interface IPitchAggregate extends IPitch {
  aggregated: {
    author: Partial<IUser>;
    writer: Partial<IUser>;
    primaryEditor: Partial<IUser>;
    secondaryEditors: Partial<IUser>[];
    thirdEditors: Partial<IUser>[];
    assignmentContributors: {
      user: Partial<IUser>;
      teams: string[];
    }[];
    pendingContributors: {
      user: Partial<IUser>;
      teams: string[];
    }[];
    reviewedBy: Partial<IUser>;
    teams: Array<ITeam & { target: number }>;
  };
}

/**
 * Interface for a Resource Schema.
 */
export interface IResource {
  _id: string;
  name: string;
  link: string;
  teams: string[];
  isGeneral: boolean;
  visibility: string;
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

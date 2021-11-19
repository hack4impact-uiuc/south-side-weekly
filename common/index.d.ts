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
  races: string[];
  interests: string[];
  onboardReasoning: string;
}

export interface IUserAggregate extends IUser {
  aggregated: {
    claimedPitches: Partial<IPitch>[];
    submittedPitches: Partial<IPitch>[];
    interests: IInterest[];
  };
}

/**
 * Interface for a Pitch Schema.
 */
export interface IPitch {
  _id: string;
  title: string;
  issues: { format: string; publicationDate: Date }[];
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
  pendingContributors: { userId: string; teams: string[]; message: string }[];
  topics: string[];
  teams: {
    teamId: string;
    target: number;
  }[];
  reviewedBy: string;
  similarStories: string[];
  deadline: Date;
  conflictOfInterest: boolean;
  neighborhoods: string[];
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
    interests: IInterest[];
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
 * Interface for a Interest Schema.
 */
export interface IInterest {
  _id: string;
  name: string;
  color: string;
  active: boolean;
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

/**
 * Interface for a Issue Schema.
 */
export interface IIssue {
  _id: string;
  name: string;
  deadlineDate: string;
  releaseDate: string;
  pitches: string[];
  type: string;
}

export interface IPitchFeedback {
  pitchId: string;
  firstQuestion: string;
  secondQuestion: string;
  thirdQuestion: string;
  dateCreated: Date;
}
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
  currentTeams: string[];
  role: string;
  hasRoleApproved: boolean;
  races: string[];
  interests: string[];
}

interface IUserAggregate extends IUser {
  aggregated: {
      claimedPitches: Partial<IPitch>[],
      submittedPitches: Partial<IPitch>[],
  }
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
  assignmentContributors: {userId: string, teams: string[]}[],
  pendingContributors: {userId: string, teams: string[]}[],
  topics: string[];
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
  reviewedBy: string;
  similarStories: string[];
  deadline: Date;
  conflictOfInterest: boolean;
}

interface IPitchAggregate extends IPitch {
  aggregated: {
      author: Partial<IUser>,
      assignmentContributors: {
          user: Partial<IUser>,
          teams: string[]
      }[],
      pendingContributors: {
          user: Partial<IUser>,
          teams: string[]
      }[],
      reviewedBy: Partial<IUser>
  }
}

/**
 * Interface for a Resource Schema.
 */
export interface IResource {
  name: string;
  link: string;
  teamRoles: string[];
  _id: string;
  visibility: string;
}

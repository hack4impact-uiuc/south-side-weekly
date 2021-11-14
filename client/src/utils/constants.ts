import { IPitch, IPitchAggregate, IUser } from 'ssw-common';

import { wizardPages } from './enums';

const allGenders = ['Man', 'Woman', 'Nonbinary', 'Other'];
const allPronouns = ['He/his', 'She/her', 'They/them', 'Ze/hir', 'Other'];
const allRoles = ['ADMIN', 'STAFF', 'CONTRIBUTOR'];
const allRaces = [
  'AMERICAN INDIAN OR ALASKAN NATIVE',
  'BLACK OR AFRICAN AMERICAN',
  'MIDDLE EASTERN OR NORTH AFRICAN',
  'NATIVE HAWAIIAN OR PACIFIC ISLANDER',
  'LATINX OR HISPANIC',
  'WHITE',
  'ASIAN',
  'OTHER',
];

const staffPages = [
  wizardPages.ONBOARD_1,
  wizardPages.ONBOARD_2,
  wizardPages.ONBOARD_3,
];
const contributorPages = [
  wizardPages.ONBOARD_1,
  wizardPages.ONBOARD_2,
  wizardPages.ONBOARD_3,
  wizardPages.ONBOARD_4,
  wizardPages.ONBOARD_5,
];

const emptyUser: IUser = {
  _id: '',
  firstName: '',
  lastName: '',
  preferredName: '',
  email: '',
  phone: '',
  oauthID: '',
  genders: [],
  pronouns: [],
  dateJoined: new Date(Date.now()),
  masthead: false,
  onboardingStatus: '',
  visitedPages: [],
  profilePic: '',
  portfolio: '',
  linkedIn: '',
  twitter: '',
  involvementResponse: '',
  claimedPitches: [],
  submittedPitches: [],
  teams: [],
  role: '',
  hasRoleApproved: false,
  races: [],
  interests: [],
  rejectReasoning: '',
};

const emptyPitch: IPitch = {
  _id: '',
  title: '',
  author: '',
  writer: '',
  primaryEditor: '',
  secondEditors: [],
  thirdEditors: [],
  issues: [],
  conflictOfInterest: false,
  status: '',
  description: '',
  assignmentStatus: '',
  assignmentGoogleDocLink: '',
  assignmentContributors: [],
  pendingContributors: [],
  topics: [],
  teams: [],
  reviewedBy: '',
  similarStories: [],
  deadline: new Date(),
};

const emptyAggregatePitch: IPitchAggregate = {
  aggregated: {
    author: emptyUser,
    writer: emptyUser,
    primaryEditor: emptyUser,
    secondaryEditors: [emptyUser],
    thirdEditors: [emptyUser],
    assignmentContributors: [],
    pendingContributors: [],
    reviewedBy: emptyUser,
    teams: [],
    interests: [],
  },
  ...emptyPitch,
};

export {
  allGenders,
  allPronouns,
  allRoles,
  allRaces,
  emptyUser,
  emptyPitch,
  emptyAggregatePitch,
  staffPages,
  contributorPages,
};

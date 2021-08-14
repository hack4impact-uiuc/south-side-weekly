import { IPitch, IUser } from 'ssw-common';

import { wizardPages } from './enums';

const allInterests = [
  'POLITICS',
  'EDUCATION',
  'HOUSING',
  'LIT',
  'MUSIC',
  'VISUAL ARTS',
  'STAGE AND SCREEN',
  'FOOD AND LAND',
  'NATURE',
  'TRANSPORTATION',
  'HEALTH',
  'CANNABIS',
  'IMMIGRATION',
  'FUN',
];

const allTeams = [
  'EDITING',
  'WRITING',
  'VISUALS',
  'PHOTOGRAPHY',
  'ILLUSTRATION',
  'FACT-CHECKING',
];

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
  onboarding: '',
  profilePic: '',
  portfolio: '',
  linkedIn: '',
  twitter: '',
  involvementResponse: '',
  claimedPitches: [],
  submittedPitches: [],
  currentTeams: [],
  role: '',
  races: [],
  interests: [],
};

const emptyPitch: IPitch = {
  _id: '',
  title: '',
  author: '',
  conflictOfInterest: false,
  status: '',
  description: '',
  assignmentStatus: '',
  assignmentGoogleDocLink: '',
  assignmentContributors: [],
  pendingContributors: [],
  topics: [],
  teams: {
    writers: {
      current: 0,
      target: 0,
    },
    editors: {
      current: 0,
      target: 0,
    },
    visuals: {
      current: 0,
      target: 0,
    },
    illustration: {
      current: 0,
      target: 0,
    },
    photography: {
      current: 0,
      target: 0,
    },
    factChecking: {
      current: 0,
      target: 0,
    },
  },
  approvedBy: '',
  similarStories: [],
  deadline: new Date(),
};

export {
  allInterests,
  allTeams,
  allGenders,
  allPronouns,
  allRoles,
  allRaces,
  emptyUser,
  emptyPitch,
  staffPages,
  contributorPages,
};

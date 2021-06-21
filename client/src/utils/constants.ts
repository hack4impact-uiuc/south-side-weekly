import { IUser } from 'ssw-common';

// All of the interests buttons to show
const interestsButtons: { [key: string]: string } = {
  Cannabis: '#CFE7C4',
  Education: '#A9D3E5',
  'Food and Land': '#BFEBE0',
  Fun: '#F9B893',
  Health: '#F9B893',
  Housing: '#EF8B8B',
  Immigration: '#D8ACE8',
  Literature: '#A5C4F2',
  Music: '#BFEBE0',
  Nature: '#CFE7C4',
  Politics: '#A5C4F2',
  'Stage and Screen': '#D8ACE8',
  Transportation: '#F1D8B0',
  'Visual Arts': '#BAB9E9',
};

// All of the buttons to show for the current teams
const currentTeamsButtons: { [key: string]: string } = {
  // Data: '#EF8B8B',
  Editing: '#A5C4F2',
  'Fact-checking': '#CFE7C4',
  Illustration: '#BAB9E9',
  // Layout: '#F9B893',
  Photography: '#D8ACE8',
  // Radio: '#F1D8B0',
  Visuals: '#BFEBE0',
  Writing: '#A9D3E5',
};

const teamToTeamsButtons: { [key: string]: string } = {
  writers: 'Writing',
  editors: 'Editing',
  visuals: 'Visuals',
  illustration: 'Illustration',
  photography: 'Photography',
  factChecking: 'Fact-checking',
};

// Team name in database format to display format
const dbTeamToDisplay: { [key: string]: string } = {
  General: 'General',
  Editing: 'Editing',
  Factchecking: 'Fact-checking',
  Illustration: 'Illustration',
  Photography: 'Photography',
  Onboarding: 'Onboarding',
  Visuals: 'Visuals',
  Writing: 'Writing',
};

const enumToInterestButtons: { [key: string]: string } = {
  CANNABIS: 'Cannabis',
  EDUCATION: 'Education',
  'FOOD AND LAND': 'Food and Land',
  FUN: 'Fun',
  HEALTH: 'Health',
  HOUSING: 'Housing',
  IMMIGRATION: 'Immigration',
  LITERATURE: 'Literature',
  MUSIC: 'Music',
  NATURE: 'Nature',
  POLITICS: 'Politics',
  'STAGE AND SCREEN': 'Stage and Screen',
  TRANSPORTATION: 'Transportation',
  'VISUAL ARTS': 'Visual Arts',
};

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

const emptyUser: IUser = {
  _id: '',
  firstName: '',
  lastName: '',
  preferredName: '',
  email: '',
  phone: '',
  oauthID: '',
  genders: [''],
  pronouns: [''],
  dateJoined: new Date(Date.now()),
  masthead: false,
  onboarding: '',
  profilePic: '',
  portfolio: '',
  linkedIn: '',
  twitter: '',
  claimedPitches: [''],
  submittedPitches: [''],
  currentTeams: [''],
  role: '',
  races: [''],
  interests: [''],
};

export {
  interestsButtons,
  currentTeamsButtons,
  dbTeamToDisplay,
  enumToInterestButtons,
  teamToTeamsButtons,
  allInterests,
  allTeams,
  allGenders,
  allPronouns,
  allRoles,
  allRaces,
  emptyUser,
};

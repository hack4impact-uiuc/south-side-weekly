import { wizardPages } from './enums';
import neighborhoods from './neighborhoods';

const allGenders = ['Man', 'Woman', 'Nonbinary', 'Other'];
const allPronouns = ['He/his', 'She/her', 'They/them', 'Ze/hir', 'Other'];
const allRoles = ['ADMIN', 'STAFF', 'CONTRIBUTOR'];
const allActivities = ['Active', 'Recently Active', 'Inactive'];
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

const pitchDocTabs = {
  UNCLAIMED: 'Claim a Pitch',
  APPROVED: 'View All Pitches',
  PITCH_APPROVAL: 'Review Pitches',
  CLAIM_APPROVAL: 'Assign Pitch Contributors',
};

const pitchQuestionOptions = [
  {
    value: 'firstQuestion',
    text: 'Is there any way that the Weekly staff could have supported you better during the Weekly’s writing/editing process of the story?',
  },
  {
    value: 'secondQuestion',
    text: 'Can you share anything about your reporting/writing process that would be useful for other writers to know, or any lessons you learned from the process?',
  },
  {
    value: 'thirdQuestion',
    text: 'List any new contacts you made that could be useful for future Weekly writers to have (include name, organizational affiliation, contact info):',
  },
  { value: 'fourthQuestion', text: 'Any additional feedback? Thank you!' },
];

export {
  allGenders,
  allPronouns,
  allRoles,
  allActivities,
  allRaces,
  staffPages,
  contributorPages,
  pitchDocTabs,
  neighborhoods,
  pitchQuestionOptions,
};

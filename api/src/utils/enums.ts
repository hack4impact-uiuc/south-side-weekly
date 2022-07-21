const rolesEnum = {
  CONTRIBUTOR: 'CONTRIBUTOR',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
  TBD: 'TBD',
};

const racesEnum = {
  AMERICAN_INDIAN_OR_ALASKAN_NATIVE: 'AMERICAN INDIAN OR ALASKAN NATIVE',
  BLACK_OR_AFRICAN_AMERICAN: 'BLACK OR AFRICAN AMERICAN',
  MIDDLE_EASTERN_OR_NORTH_AFRICAN: 'MIDDLE EASTERN OR NORTH AFRICAN',
  NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER: 'NATIVE HAWAIIAN OR PACIFIC ISLANDER',
  LATINX_OR_HISPANIC: 'LATINX OR HISPANIC',
  WHITE: 'WHITE',
  ASIAN: 'ASIAN',
  OTHER: 'OTHER',
  NONE: 'NONE',
};

const onboardingStatusEnum = {
  ONBOARDING_SCHEDULED: 'ONBOARDING_SCHEDULED',
  STALLED: 'STALLED',
  ONBOARDED: 'ONBOARDED',
  DENIED: 'DENIED',
};

const pagesEnum = {
  HOMEPAGE: 'HOMEPAGE',
  PITCHDOC: 'PITCHDOC',
  DIRECTORY: 'DIRECTORY',
  RESOURCES: 'RESOURCES',
};

const pitchStatusEnum = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  DECLINED: 'DECLINED',
  NONE: 'NONE',
};

const assignmentStatusEnum = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ABANDONED: 'ABANDONED',
  NONE: 'NONE',
};

const issueTypeEnum = {
  PRINT: 'PRINT',
  ONLINE: 'ONLINE',
};

const visibilityEnum = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

const issueStatusEnum = {
  MAYBE_IN: 'MAYBE_IN',
  DEFINITELY_IN: 'DEFINITELY_IN',
  READY_TO_PUBLISH: 'READY_TO_PUBLISH',
  COMING_LATE: 'COMING_LATE',
  PUSH: 'PUSH',
};

const claimStatusEnum = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  DECLINED: 'DECLINED',
};

const editorTypeEnum = {
  PRIMARY: 'Primary',
  SECONDS: 'Seconds',
  THIRDS: 'Thirds',
};

const editStatusEnum = {
  WRITER_NEEDED: 'Writer Needed',
  FIRST_NEEDED: '1st Needed',
  FIRST_IP: '1st In Progress',
  SECONDS_NEEDED: '2nds Needed',
  SECONDS_IP: '2nds In Progress',
  FC_IP: 'Fact-Checking In Progress',
  THIRDS_NEEDED: '3rds Needed',
  THIRDS_IP: '3rds In Progress',
  READY_TO_PUBLISH: 'Ready to Publish',
  DROPPED: 'Dropped',
  TRANSLATION_IP: 'Translation In Progress',
};

const factCheckingStatusEnum = {
  NEEDS_FC: 'Needs FC',
  FC_IN_PROGRESS: 'FC In Progress',
  FC_DONE: 'FC Done',
  NOT_INTEGRATED: 'Not Integrated',
  FC_INTEGRATED: 'FC Integrated',
};

const visualStatusEnum = {
  UNASSIGNED: 'Unassigned',
  IN_PROGRESS: 'In Progress',
  REUSE_ILLUSTRATION: 'Re-use Illustration',
  IN_DRIVE: 'In Drive',
  UNCERTAIN: 'Uncertain',
};

const layoutStatusEnum = {
  IN_PROGRESS: 'In Progress',
  LAYOUT_DRAFTED: 'Layout Drafted',
  COPY_PLACED: 'Copy Placed',
  BOARD_PRINTED: 'Board Printed',
  FINALIZED: 'Finalized',
};

export {
  issueTypeEnum,
  rolesEnum,
  racesEnum,
  onboardingStatusEnum,
  pagesEnum,
  pitchStatusEnum,
  assignmentStatusEnum,
  visibilityEnum,
  issueStatusEnum,
  editStatusEnum,
  claimStatusEnum,
  editorTypeEnum,
  factCheckingStatusEnum,
  visualStatusEnum,
  layoutStatusEnum,
};

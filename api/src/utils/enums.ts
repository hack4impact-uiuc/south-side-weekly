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
  UNCLAIMED: 'UNCLAIMED',
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
  IN_EDITS: 'IN_EDITS',
  READY_TO_PUBLISH: 'READY_TO_PUBLISH',
  PUSH: 'PUSH',
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
};

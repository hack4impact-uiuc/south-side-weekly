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
  REJECTED: 'REJECTED',
  NONE: 'NONE',
};

const assignmentStatusEnum = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ABANDONED: 'ABANDONED',
  NONE: 'NONE',
};

const issueStatusEnum = {
  DEFINITELY_IN: 'DEFINITELY_IN',
  MAYBE_IN: 'MAYBE_IN',
  COMING_LATE: 'COMING_LATE',
  PUSH: 'PUSH',
}

const issueTypeEnum = {
  PRINT: 'PRINT',
  ONLINE: 'ONLINE',
};

const visibilityEnum = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
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
};

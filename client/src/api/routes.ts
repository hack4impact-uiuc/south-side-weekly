// Auth endpoints
export const GET_CURRENT_USER = '/auth/currentUser';
export const GET_LOGIN_STATUS = '/auth/loggedin';
export const LOGIN = '/auth/login';
export const LOGOUT = '/auth/logout';

// User endpoints
export const GET_USERS = '/users';
export const GET_PENDING_USERS = '/users/pending';
export const GET_APPROVED_USERS = '/users/approved';
export const GET_DENIED_USERS = '/users/denied';
export const GET_USER = '/users/:id';
export const GET_USER_PERMISSIONS = '/users/:id/permissions';
export const CREATE_USER = '/users';
export const VISIT_PAGE = '/users/visitPage';
export const UPDATE_USER = '/users/:id';
export const APPROVE_USER = '/users/:id/approve';
export const REJECT_USER = '/users/:id/deny';
export const CLAIM_PITCH = '/users/:id/claimPitch';
export const DELETE_USER = '/users/:id';

// Pitch endpoints
export const GET_PITCHES = '/pitches';
export const GET_PENDING_PITCHES = '/pitches/pending';
export const GET_APPROVED_PITCHES = '/pitches/approved';
export const GET_PENDING_CLAIMS = '/pitches/pendingClaims';
export const GET_PITCH = '/pitches/:id';
export const CREATE_PITCH = '/pitches';
export const UPDATE_PITCH = '/pitches/:id';
export const APPROVE_PITCH = '/pitches/:id/approve';
export const REJECT_PITCH = '/pitches/:id/deny';
export const SUBMIT_CLAIM = '/pitches/:id/submitClaim';
export const DELETE_PITCH = '/pitches/:id';

// Resource endpoints
export const GET_RESOURCES = '/resources';
export const GET_RESOURCE = '/resources/:id';
export const CREATE_RESOURCE = '/resources';
export const UPDATE_RESOURCE = '/resources/:id';
export const DELETE_RESOURCE = '/resources/:id';

// Issue endpoints
export const GET_ISSUES = '/issues';
export const GET_ISSUE = '/issues/:id';
export const GET_PITCH_BUCKETS = '/issues/pitchBuckets/:id';
export const CREATE_ISSUE = '/issues';
export const UPDATE_ISSUE = '/issues/:id';
export const UPDATE_ISSUE_STATUS = '/issues/:id/updateIssueStatus';

// Interest endpoints
export const GET_INTERESTS = '/interests';
export const GET_INTEREST = '/interests/:id';
export const CREATE_INTEREST = '/interests';
export const CREATE_MANY_INTERESTS = '/interests/many';
export const UPDATE_INTEREST = '/interests/:id';
export const UPDATE_MANY_INTERESTS = '/interests/many';

// Team endpoints
export const GET_TEAMS = '/teams';
export const GET_TEAM = '/teams/:id';
export const CREATE_TEAM = '/teams';
export const CREATE_MANY_TEAMS = '/teams/many';
export const UPDATE_TEAM = '/teams/:id';
export const UPDATE_MANY_TEAMS = '/teams/many';

// Constants endpoints
export const GET_CONSTANTS = '/constants';

// User feedback endpoints
export const GET_USER_FEEDBACKS = '/userFeedbacks';
export const GET_USER_FEEDBACK = '/userFeedbacks/:id';
export const GET_FEEDBACK_FOR_USER = '/userFeedbacks/user/:id';
export const CREATE_USER_FEEDBACK = '/userFeedbacks';
export const UPDATE_USER_FEEDBACK = '/userFeedbacks/:id';
export const DELETE_USER_FEEDBACK = '/userFeedbacks/:id';

// Pitch feedback endpoints
export const GET_PITCH_FEEDBACKS = '/pitchFeedbacks';
export const GET_PITCH_FEEDBACK = '/pitchFeedbacks/:id';
export const GET_FEEDBACK_FOR_PITCH = '/pitchFeedbacks/pitch/:id';
export const CREATE_PITCH_FEEDBACK = '/pitchFeedbacks';
export const UPDATE_PITCH_FEEDBACK = '/pitchFeedbacks/:id';
export const DELETE_PITCH_FEEDBACK = '/pitchFeedbacks/:id';

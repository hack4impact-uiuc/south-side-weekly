import { create } from 'lodash';

export { getCurrentUser, logout } from './auth';
export {
  getUser,
  getUsers,
  updateUserClaimedPitches,
  updateUser,
  getUserPermissionsByID,
  updateOnboardingStatus,
  approveUser,
  declineUser,
  getAggregatedUser,
} from './user';
export {
  getApprovedPitches,
  updatePitch,
  submitPitchClaim,
  getPitchesPendingApproval,
  getUnclaimedPitches,
  getPendingContributorPitches,
  getAggregatedPitch,
  createPitch,
  approvePitch,
  declinePitch,
} from './pitch';
export {
  createResource,
  getAllResources,
  deleteResource,
  editResource,
} from './resource';

export {
  getInterests,
  getInterest,
  createInterest,
  updateInterest,
  createManyInterests,
  updateManyInterests,
} from './interest';
export { getIssues } from './issue';
export { getTeams, createManyTeams, updateManyTeams } from './teams';
export {createUserFeedback} from './userfeedback';
export { isError, buildLoginEndpoint, buildEndpoint } from './builders';

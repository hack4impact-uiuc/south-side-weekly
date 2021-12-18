import {
  getUsers,
  getApprovedUsers,
  getPendingUsers,
  getDeniedUsers,
  getUserById,
  getUserPermissions,
} from './get';
import { createUser } from './post';
import {
  updateUser,
  approveUser,
  denyUser,
  claimPitch,
  visitPage,
  stallUsers,
} from './put';
import { deleteUser } from './delete';

export const userPaths = {
  '/users': {
    ...getUsers,
  },
  '/users/approved': {
    ...getApprovedUsers,
  },
  '/users/pending': {
    ...getPendingUsers,
  },
  '/users/denied': {
    ...getDeniedUsers,
  },
  '/users/{id}': {
    ...getUserById,
    ...createUser,
    ...updateUser,
    ...deleteUser,
  },
  '/users/{id}/approve': {
    ...approveUser,
  },
  '/users/{id}/deny': {
    ...denyUser,
  },
  '/users/{id}/claimPitch': {
    ...claimPitch,
  },
  '/users/{id}/permissions': {
    ...getUserPermissions,
  },
  '/users/visitPage': {
    ...visitPage,
  },
  '/users/stallUsers': {
    ...stallUsers,
  },
};

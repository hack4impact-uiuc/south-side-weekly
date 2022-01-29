import {
  BasePopulatedPitch,
  BasePopulatedUser,
  PopulatedUserFeedback,
  User,
} from 'ssw-common';
import toast from 'react-hot-toast';

import { rolesEnum } from '../utils/enums';

import { isError } from './builders';

import { apiCall } from '.';

// API call to load a user's permissions
export const loadUserPermissions = async (
  userId: string,
): Promise<{ view: (keyof User)[]; edit: (keyof User)[] }> => {
  const res = await apiCall<{ view: (keyof User)[]; edit: (keyof User)[] }>({
    url: `/users/${userId}/permissions`,
    method: 'GET',
  });

  if (!isError(res)) {
    return res.data.result;
  }

  return { view: [], edit: [] };
};

export const loadFullUser = async (
  id: string,
): Promise<BasePopulatedUser | null> => {
  const res = await apiCall<BasePopulatedUser>({
    url: `/users/${id}`,
    method: 'GET',
    populate: 'default',
  });

  if (!isError(res)) {
    const user = res.data.result;
    return user;
  }

  console.error(res.error);
  return null;
};

export const loadFullFeedback = async (
  ids: string[],
): Promise<PopulatedUserFeedback[]> => {
  const query = {
    _id__in: ids.join(','),
  };

  const res = await apiCall<{ data: PopulatedUserFeedback[]; count: number }>({
    url: `/userFeedback`,
    method: 'GET',
    query,
    populate: 'default',
  });

  if (!isError(res)) {
    const feedback = res.data.result.data;
    return feedback;
  }

  console.error(res.error);
  return [];
};

export const loadBasePitch = async (
  id: string,
): Promise<BasePopulatedPitch | null> => {
  const pitches = await loadBasePitches([id]);

  return pitches.length > 0 ? pitches[0] : null;
};

export const loadBasePitches = async (
  ids: string[],
): Promise<BasePopulatedPitch[]> => {
  const query = {
    _id__in: ids.join(','),
  };

  const res = await apiCall<{ data: BasePopulatedPitch[]; count: number }>({
    url: `/pitches`,
    method: 'GET',
    query,
    populate: 'default',
  });

  if (!isError(res)) {
    const pitches = res.data.result.data;
    return pitches;
  }

  console.error(res.error);
  return [];
};

export const loadWriters = async (): Promise<BasePopulatedUser[]> => {
  const res = await apiCall<{ users: BasePopulatedUser[]; count: number }>({
    url: `/users`,
    method: 'GET',
    populate: 'default',
  });

  if (!isError(res)) {
    return res.data.result.users.filter((user) =>
      user.teams.find((team) => team.name.toLowerCase() === 'writing'),
    );
  }

  return [];
};

export const loadPrimaryEditors = async (): Promise<BasePopulatedUser[]> => {
  const res = await apiCall<{ users: BasePopulatedUser[]; count: number }>({
    url: `/users`,
    method: 'GET',
    query: {
      role: rolesEnum.ADMIN,
    },
    populate: 'default',
  });

  if (!isError(res)) {
    return res.data.result.users.filter((user) =>
      user.teams.find((team) => team.name.toLowerCase() === 'editing'),
    );
  }

  return [];
};

export const loadEditors = async (): Promise<BasePopulatedUser[]> => {
  const res = await apiCall<{ users: BasePopulatedUser[]; count: number }>({
    url: `/users`,
    method: 'GET',
    query: {
      role: rolesEnum.STAFF,
    },
    populate: 'default',
  });

  if (!isError(res)) {
    return res.data.result.users.filter((user) =>
      user.teams.find((team) => team.name.toLowerCase() === 'editing'),
    );
  }

  return [];
};

export const approveUser = async (
  user: BasePopulatedUser,
  currentUser: BasePopulatedUser | undefined,
): Promise<void> => {
  if (!currentUser) {
    return;
  }

  const res = await apiCall({
    method: 'PUT',
    url: `/users/${user._id}/approve`,
  });

  await apiCall({
    method: 'POST',
    url: `/notifications/sendUserApproved`,
    body: {
      contributorId: user._id,
      reviewerId: currentUser._id,
    },
  });

  if (!isError(res)) {
    toast.success('User approved');
  } else {
    toast.error('Error approving user');
  }
};

export const rejectUser = async (
  user: BasePopulatedUser,
  currentUser: BasePopulatedUser | undefined,
): Promise<void> => {
  if (!currentUser) {
    return;
  }

  const res = await apiCall({
    method: 'PUT',
    url: `/users/${user._id}/deny`,
  });
  apiCall({
    method: 'POST',
    url: `/notifications/sendUserRejected`,
    body: {
      contributorId: user._id,
      reviewerId: currentUser._id,
    },
  });

  if (!isError(res)) {
    toast.success('User rejected');
  } else {
    toast.error('Error rejecting user');
  }
};

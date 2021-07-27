import { toUpper } from 'lodash';
import { IUser } from 'ssw-common';

const filterInterests = (users: IUser[], interests: string[]): IUser[] => {
  if (interests.length === 0) {
    return users;
  }

  return users.filter((user) =>
    interests.every((interest) => user.interests.includes(toUpper(interest))),
  );
};

const filterRole = (users: IUser[], role: string): IUser[] => {
  if (role.length === 0) {
    return users;
  }

  return users.filter((user) => toUpper(user.role) === toUpper(role));
};

const filterTeams = (users: IUser[], teams: string[]): IUser[] => {
  if (teams.length === 0) {
    return users;
  }

  return users.filter((user) =>
    teams.every((team) => user.currentTeams.includes(toUpper(team))),
  );
};

const sortUsers = (
  users: IUser[],
  sort: 'none' | 'increase' | 'decrease',
): IUser[] => {
  if (sort === 'none') {
    return users;
  }

  users.sort((a, b) => {
    const first = new Date(a.dateJoined);
    const second = new Date(b.dateJoined);
    if (sort === 'increase') {
      if (first > second) {
        return 1;
      } else if (first < second) {
        return Number.MIN_SAFE_INTEGER;
      }
    } else if (sort === 'decrease') {
      if (first > second) {
        return Number.MIN_SAFE_INTEGER;
      } else if (first < second) {
        return 1;
      }
    }

    return 0;
  });

  return users;
};

export { filterInterests, filterRole, filterTeams, sortUsers };

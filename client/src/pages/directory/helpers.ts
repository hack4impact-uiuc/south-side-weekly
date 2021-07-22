import { toUpper } from 'lodash';
import { IUser } from 'ssw-common';

const filterInterests = (users: IUser[], interests: string[]): IUser[] => {
  if (interests.length === 0) {
    return users;
  }

  return users.filter((user) =>
    interests.some((interest) => user.interests.includes(toUpper(interest))),
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
    teams.some((team) => user.currentTeams.includes(toUpper(team))),
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
      return first.getTime() - second.getTime();
    }

    return second.getTime() - first.getTime();
  });

  return users;
};

export { filterInterests, filterRole, filterTeams, sortUsers };

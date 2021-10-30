import { toUpper } from 'lodash';
import { IPitch } from 'ssw-common';

import { getPitchTeams, isPitchClaimed } from '../../utils/helpers';

const filterInterests = (pitches: IPitch[], interests: string[]): IPitch[] => {
  if (interests.length === 0) {
    return pitches;
  }

  return pitches.filter((pitch) =>
    interests.every((interest) => pitch.topics.includes(toUpper(interest))),
  );
};

const filterClaimStatus = (
  pitches: IPitch[],
  claimStatus: string,
): IPitch[] => {
  if (claimStatus.length === 0) {
    return pitches;
  }

  const handleFilterCondition = (pitch: IPitch): boolean => {
    const isClaimed = isPitchClaimed(pitch);

    if (claimStatus === 'Claimed') {
      return isClaimed;
    } else if (claimStatus === 'Unclaimed') {
      return !isClaimed;
    }

    console.error('FALSE ERROR');
    return false;
  };

  return pitches.filter(handleFilterCondition);
};

const filterTeams = (pitches: IPitch[], teams: string[]): IPitch[] => {
  if (teams.length === 0) {
    return pitches;
  }

  return pitches.filter((pitch) =>
    teams.every((team) => getPitchTeams(pitch).includes(team)),
  );
};

const sortPitches = (
  pitches: IPitch[],
  sort: 'none' | 'increase' | 'decrease',
): IPitch[] => {
  if (sort === 'none') {
    return pitches;
  }

  pitches.sort((a, b) => {
    const first = new Date(a.deadline);
    const second = new Date(b.deadline);
    if (sort === 'increase') {
      return first.getTime() - second.getTime();
    }

    return second.getTime() - first.getTime();
  });

  return pitches;
};

export { filterInterests, filterClaimStatus, filterTeams, sortPitches };

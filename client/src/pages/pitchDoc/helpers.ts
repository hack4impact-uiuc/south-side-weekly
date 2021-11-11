import { IPitch } from 'ssw-common';
import { getPitchTeams, isPitchClaimed } from '../../utils/helpers';

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

export { filterClaimStatus, filterTeams };

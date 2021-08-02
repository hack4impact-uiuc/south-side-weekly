import { IPitch } from 'ssw-common';

export const isPitchClaimed = (pitch: IPitch): boolean =>
  Object.entries(pitch.teams).every(
    (team) => team[1].current === team[1].target,
  );

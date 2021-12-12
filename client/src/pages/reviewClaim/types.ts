import { IPitchAggregate, ITeam, IUser } from 'ssw-common';

export interface ParamTypes {
  pitchId: string;
}

type AllContributorsForTeam = {
  pending: Partial<IUser>[];
  assignment: Partial<IUser>[];
};

export type TeamContributorRecord = Record<
  ITeam['_id'],
  AllContributorsForTeam
>;

export type editorContributorsType = Pick<
  IPitchAggregate['aggregated'],
  'primaryEditor' | 'secondaryEditors' | 'thirdEditors'
>;

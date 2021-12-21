import { IPitchAggregate, ITeam, IUser } from 'ssw-common';
import { editorTypesEnum } from '../../utils/enums';

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

export type EditorRecord = Record<ITeam['_id'], UserWithEditorType>;

type UserWithEditorType = Partial<IUser> & { editorType: string };

export type editorContributorsType = Pick<
  IPitchAggregate['aggregated'],
  'primaryEditor' | 'secondaryEditors' | 'thirdEditors'
>;

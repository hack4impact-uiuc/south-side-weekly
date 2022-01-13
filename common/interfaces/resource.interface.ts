import { TeamFields } from "./_types";

export interface Resource {
    _id: string;
    name: string;
    link: string;
    teams: string[];
    isGeneral: boolean;
    visibility: string;
    createdAt: Date;
    updatedAt: Date;
}

type BaseResourceOmitFields = 'teams';

export interface PopulatedResource extends Omit<Resource, BaseResourceOmitFields> {
    teams: TeamFields[];
}
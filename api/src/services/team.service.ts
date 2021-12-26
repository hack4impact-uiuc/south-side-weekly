import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import { ITeam } from 'ssw-common';

import Team, { TeamSchema } from '../models/team.model';

type Teams = Promise<LeanDocument<TeamSchema>[]>;
type Team = Promise<LeanDocument<TeamSchema>>;

const updateModel = async <T>(
  filters: FilterQuery<T>,
  payload: UpdateQuery<T>,
): Team =>
  await Team.findByIdAndUpdate(filters, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const add = async (payload: Partial<ITeam>): Team =>
  await Team.create(payload);

export const addMany = async (payload: Partial<ITeam>[]): Teams =>
  await Team.insertMany(payload);

export const getOne = async (_id: string): Team =>
  await Team.findById({ _id }).lean();

export const getAll = async (): Teams => await Team.find({}).lean();

export const update = async (_id: string, payload: Partial<ITeam>): Team =>
  await updateModel({ _id }, payload);

export const updateMany = async (payloads: Partial<ITeam>[]): Teams =>
  await Promise.all(
    payloads.map((payload) => updateModel({ _id: payload._id }, payload)),
  );

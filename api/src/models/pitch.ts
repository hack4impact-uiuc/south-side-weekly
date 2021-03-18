import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

import {
  interestsEnum,
  pitchStatusEnum,
  assignmentStatusEnum,
} from '../utils/enums';

export interface IStats extends Document<any> {
  current: number;
  target: number;
}

export interface ITeams extends Document<any> {
  writers: IStats;
  editors: IStats;
  visuals: IStats;
  illustration: IStats;
  photography: IStats;
  factChecking: IStats;
}

export interface IPitch extends Document<any> {
  name: string;
  pitchAuthor: mongoose.Types.ObjectId;
  pitchStatus: string;
  assignmentStatus: string;
  assignmentGoogleDocLink: string;
  assignmentContributors: [IUser];
  topics: [string];
  teams: ITeams;
  approvedBy: IUser;
  similarStories: [string];
  deadline: Date;
}

const defaultTeams: { [key: string]: { [key: string]: number } } = {
  writers: { current: 1, target: 1 },
  editors: { current: 1, target: 1 },
  visuals: { current: 1, target: 1 },
  illustration: { current: 1, target: 1 },
  photography: { current: 1, target: 1 },
  factChecking: { current: 1, target: 1 },
};

/**
 * Mongoose Schema to represent a Pitch at South Side Weekly
 */
const Pitch = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  pitchAuthor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  pitchStatus: {
    type: String,
    enum: Object.values(pitchStatusEnum),
    default: pitchStatusEnum.NONE,
  },
  assignmentStatus: {
    type: String,
    enum: Object.values(assignmentStatusEnum),
    default: assignmentStatusEnum.NONE,
  },
  assignmentGoogleDocLink: { type: String, default: null },
  assignmentContributors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  topics: [
    {
      type: String,
      enum: Object.values(interestsEnum),
      default: interestsEnum.NONE,
    },
  ],
  teams: { type: Schema.Types.Map, default: defaultTeams },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  similarStories: [{ type: String, default: null }],
  deadline: { type: Date, default: null },
});

export default mongoose.model<IPitch>('Pitch', Pitch);

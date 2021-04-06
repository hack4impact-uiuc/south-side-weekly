import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

import {
  interestsEnum,
  pitchStatusEnum,
  assignmentStatusEnum,
} from '../utils/enums';

export interface IPitch extends Document<any> {
  _id: string;
  name: string;
  pitchAuthor: mongoose.Types.ObjectId;
  pitchStatus: string;
  assignmentStatus: string;
  assignmentGoogleDocLink: string;
  assignmentContributors: [IUser];
  topic: string;
  currentWriters: number;
  targetWriters: number;
  currentEditors: number;
  targetEditors: number;
  currentData: number;
  targetData: number;
  currentVisuals: number;
  targetVisuals: number;
  currentIllustration: number;
  targetIllustration: number;
  currentPhotography: number;
  targetPhotography: number;
  currentFactChecking: number;
  targetFactChecking: number;
  currentRadio: number;
  targetRadio: number;
  currentLayout: number;
  targetLayout: number;
  approvedBy: IUser;
  similarStories: [string];
  deadline: Date;
}

/**
 * Mongoose Schema to represent a Pitch at South Side Weekly
 */
const Pitch = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  pitchAuthor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  pitchStatus: { type: pitchStatusEnum, default: pitchStatusEnum.NONE },
  assignmentStatus: {
    type: assignmentStatusEnum,
    default: assignmentStatusEnum.NONE,
  },
  assignmentGoogleDocLink: { type: String, default: null },
  assignmentContributors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  topic: { type: interestsEnum, default: interestsEnum.NONE },
  currentWriters: { type: Number, default: 0 },
  targetWriters: { type: Number, default: 0 },
  currentEditors: { type: Number, default: 0 },
  targetEditors: { type: Number, default: 0 },
  currentData: { type: Number, default: 0 },
  targetData: { type: Number, default: 0 },
  currentVisuals: { type: Number, default: 0 },
  targetVisuals: { type: Number, default: 0 },
  currentIllustration: { type: Number, default: 0 },
  targetIllustration: { type: Number, default: 0 },
  currentPhotography: { type: Number, default: 0 },
  targetPhotography: { type: Number, default: 0 },
  currentFactChecking: { type: Number, default: 0 },
  targetFactChecking: { type: Number, default: 0 },
  currentRadio: { type: Number, default: 0 },
  targetRadio: { type: Number, default: 0 },
  currentLayout: { type: Number, default: 0 },
  targetLayout: { type: Number, default: 0 },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  similarStories: [{ type: String, default: null }],
  deadline: { type: Date, default: null },
});

export default mongoose.model<IPitch>('Pitch', Pitch);

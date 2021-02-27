import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface IPitch extends Document<any> {
  name: string;
  pitchAuthor: IUser;
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

const pitchStatusEnum = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  NONE: 'NONE',
};

const assignmentStatusEnum = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ABANDONED: 'ABANDONED',
  NONE: 'NONE',
};

// TODO: don't repeat this code
const interestsEnum = {
  POLITICS: 'POLITICS',
  EDUCATION: 'EDUCATION',
  HOUSING: 'HOUSING',
  LIT: 'LIT',
  MUSIC: 'MUSIC',
  VISUAL_ARTS: 'VISUAL ARTS',
  STAGE_AND_SCREEN: 'STAGE AND SCREEN',
  FOOD_AND_LAND: 'FOOD AND LAND',
  NATURE: 'NATURE',
  TRANSPORTATION: 'TRANSPORTATION',
  HEALTH: 'HEALTH',
  CANNABIS: 'CANNABIS',
  IMMIGRATION: 'IMMIGRATION',
  FUN: 'FUN',
  NONE: 'NONE',
};

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
  targetWriters: { type: Number, default: 100 },
  currentEditors: { type: Number, default: 0 },
  targetEditors: { type: Number, default: 100 },
  currentData: { type: Number, default: 0 },
  targetData: { type: Number, default: 100 },
  currentVisuals: { type: Number, default: 0 },
  targetVisuals: { type: Number, default: 100 },
  currentIllustration: { type: Number, default: 0 },
  targetIllustration: { type: Number, default: 100 },
  currentPhotography: { type: Number, default: 0 },
  targetPhotography: { type: Number, default: 100 },
  currentFactChecking: { type: Number, default: 0 },
  targetFactChecking: { type: Number, default: 100 },
  currentRadio: { type: Number, default: 0 },
  targetRadio: { type: Number, default: 100 },
  currentLayout: { type: Number, default: 0 },
  targetLayout: { type: Number, default: 100 },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  similarStories: [{ type: String, default: null }],
  deadline: { type: Date, default: null },
});

export default mongoose.model<IPitch>('Pitch', Pitch);

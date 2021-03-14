import mongoose, { Schema } from 'mongoose';
import { IPitch } from '../utils/types';

import {
  interestsEnum,
  pitchStatusEnum,
  assignmentStatusEnum,
} from '../utils/enums';

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
  topics: [
    {
      type: String,
      enum: Object.values(interestsEnum),
      default: interestsEnum.NONE,
    },
  ],
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

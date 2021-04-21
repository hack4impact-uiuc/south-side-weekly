import mongoose, { Schema, Document } from 'mongoose';
import { IPitch } from '../types/index';

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
  teams: {
    writers: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },
    editors: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },
    visuals: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },
    illustration: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },
    photography: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },
    factChecking: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  similarStories: [{ type: String, default: null }],
  deadline: { type: Date, default: null },
});

export default mongoose.model<IPitch>('Pitch', Pitch);

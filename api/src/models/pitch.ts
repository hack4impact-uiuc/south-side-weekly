import mongoose, { Document, Schema } from 'mongoose';
import { IPitch } from 'ssw-common';

import {
  interestsEnum,
  pitchStatusEnum,
  assignmentStatusEnum,
} from '../utils/enums';

export type PitchSchema = IPitch & Document<any>;

const contributor = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    teams: [{ type: String }],
  },
  { _id: false },
);

/**
 * Mongoose Schema to represent a Pitch at South Side Weekly
 */
const Pitch = new mongoose.Schema({
  title: { type: String, default: null, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  conflictOfInterest: { type: Boolean, required: true },
  status: {
    type: String,
    enum: Object.values(pitchStatusEnum),
    default: pitchStatusEnum.NONE,
  },
  description: { type: String, default: null, required: true },
  assignmentStatus: {
    type: String,
    enum: Object.values(assignmentStatusEnum),
    default: assignmentStatusEnum.NONE,
  },
  assignmentGoogleDocLink: { type: String, default: null },
  assignmentContributors: [contributor],
  pendingContributors: [contributor],
  topics: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
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
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  similarStories: [{ type: String, default: null }],
  deadline: { type: Date, default: null },
});

export default mongoose.model<PitchSchema>('Pitch', Pitch);

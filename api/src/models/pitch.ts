import mongoose, { Document, Schema } from 'mongoose';
import { IPitch } from 'ssw-common';

import {
  pitchStatusEnum,
  assignmentStatusEnum,
  issueFormatEnum,
} from '../utils/enums';

export type PitchSchema = IPitch & Document<any>;

const contributor = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  },
  { _id: false },
);

const pendingContributor = new mongoose.Schema(
  { ...contributor.obj, message: { type: String } },
  { _id: false },
);

const team = new mongoose.Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
    target: Number,
  },
  { _id: false },
);

const issue = new mongoose.Schema(
  {
    format: {
      type: String,
      enum: Object.values(issueFormatEnum),
      default: null,
      required: true,
    },
    publicationDate: { type: Date, default: null },
  },
  { _id: false },
);

/**
 * Mongoose Schema to represent a Pitch at South Side Weekly
 */
const Pitch = new mongoose.Schema({
  title: { type: String, default: null, required: true },
  issues: [issue],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  primaryEditor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  secondEditors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  thirdEditors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
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
  pendingContributors: [pendingContributor],
  topics: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
  teams: [team],
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  similarStories: [{ type: String, default: null }],
  deadline: { type: Date, default: null },
});

export default mongoose.model<PitchSchema>('Pitch', Pitch);

import mongoose, { Schema } from 'mongoose';
import { IPitch } from '../utils/types';

import {
  interestsEnum,
  pitchStatusEnum,
  assignmentStatusEnum,
} from '../utils/enums';

const defaultTeams: { [key: string]: { [key: string]: number } } = {
  writers: { current: 1, target: 1 },
  editors: { current: 1, target: 1 },
  data: { current: 1, target: 1 },
  visuals: { current: 1, target: 1 },
  illustration: { current: 1, target: 1 },
  photography: { current: 1, target: 1 },
  factChecking: { current: 1, target: 1 },
  radio: { current: 1, target: 1 },
  layout: { current: 1, target: 1 },
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

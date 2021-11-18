import mongoose, { Document, Schema } from 'mongoose';
import { IPitchFeedback } from 'ssw-common';

export type PitchFeedbackSchema = IPitchFeedback & Document<any>;

const PitchFeedback = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false,
  },
  pitchId: {
    type: Schema.Types.ObjectId,
    ref: 'Pitch',
    required: true,
  },
  responses: {
    1: { type: String, default: null },
    2: {
      type: String,
      default: null,
    },
    3: {
      type: String,
      default: null,
    },
  },
});

export default mongoose.model<PitchFeedbackSchema>(
  'PitchFeedback',
  PitchFeedback,
);

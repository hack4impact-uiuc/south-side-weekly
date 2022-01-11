import mongoose, { Document, Schema } from 'mongoose';
import { IPitchFeedback } from 'ssw-common';

export type PitchFeedbackSchema = IPitchFeedback & Document<any>;

const PitchFeedback = new mongoose.Schema(
  {
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
    firstQuestion: { type: String, default: null },
    secondQuestion: { type: String, default: null },
    thirdQuestion: { type: String, default: null },
    fourthQuestion: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model<PitchFeedbackSchema>(
  'PitchFeedback',
  PitchFeedback,
);

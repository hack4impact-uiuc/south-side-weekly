import mongoose, { Document, Schema } from 'mongoose';
import { IUserFeedback } from 'ssw-common';

export type UserFeedbackSchema = IUserFeedback & Document<any>;

/**
 * Mongoose Schema to represent Feedback for User at South Side Weekly.
 */
const UserFeedback = new mongoose.Schema(
  {
    staffId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pitchId: { type: Schema.Types.ObjectId, ref: 'Pitch', required: true },
    stars: { type: Number, default: null },
    reasoning: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model<UserFeedbackSchema>('UserFeedback', UserFeedback);

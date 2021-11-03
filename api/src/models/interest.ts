import mongoose, { Document, Schema } from 'mongoose';
import { IInterest } from 'ssw-common';

type InterestSchema = IInterest & Document;

/**
 * Mongoose Schema to represent an Interest at South Side Weekly
 */
const InterestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model<InterestSchema>('Interest', InterestSchema);

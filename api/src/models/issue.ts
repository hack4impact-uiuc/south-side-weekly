import mongoose, { Document, Schema } from 'mongoose';
import { IResource } from 'ssw-common';

type IssueSchema = IResource & Document<any>;

/**
 * Mongoose Schema to represent a Resource at South Side Weekly.
 */
const Issue = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  deadlineDate: { type: String, default: null, required: true },
  releaseDate: { type: String, default: null, required: true },
  pitches: [{ type: Schema.Types.ObjectId, ref: 'Pitch' }],
  printIssue: { type: Boolean, default: false },
  onlineIssue: { type: Boolean, default: false },
});

export default mongoose.model<IssueSchema>('Issue', Issue);

import mongoose, { Document, Schema } from 'mongoose';
import { IIssue } from 'ssw-common';
import { issueFormatEnum } from '../utils/enums';

type IssueSchema = IIssue & Document<any>;
/**
 * Mongoose Schema to represent an Issue at South Side Weekly.
 */
const Issue = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  deadlineDate: { type: String, default: null, required: true },
  releaseDate: { type: String, default: null, required: true },
  pitches: [{ type: Schema.Types.ObjectId, ref: 'Pitch' }],
  type: { type: String, enum: Object.values(issueFormatEnum) },
});

export default mongoose.model<IssueSchema>('Issue', Issue);
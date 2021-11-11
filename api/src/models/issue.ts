import mongoose, { Document, Schema } from 'mongoose';
import { IResource } from 'ssw-common';

type IssueSchema = IResource & Document<any>;
enum Type {
  printIssue,
  onlineIssue,
}
/**
 * Mongoose Schema to represent a Resource at South Side Weekly.
 */
const Issue = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  deadlineDate: { type: String, default: null, required: true },
  releaseDate: { type: String, default: null, required: true},
  pitches: [{ type: Schema.Types.ObjectId, ref: 'Pitch' }],
  type: {type: Type, required: true} 
});

export default mongoose.model<IssueSchema>('Issue', Issue);

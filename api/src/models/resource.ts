import mongoose, { Document, Schema } from 'mongoose';
import { IResource } from 'ssw-common';

type ResourceSchema = IResource & Document<any>;

/**
 * Mongoose Schema to represent a Resource at South Side Weekly.
 */
const Resource = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  link: { type: String, default: null, required: true },
  teamRoles: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
export default mongoose.model<ResourceSchema>('Resource', Resource);

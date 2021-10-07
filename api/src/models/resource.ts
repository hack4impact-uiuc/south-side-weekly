import mongoose, { Document } from 'mongoose';
import { IResource } from 'ssw-common';

import { visibilityEnum } from '../utils/enums';

type ResourceSchema = IResource & Document<any>;

/**
 * Mongoose Schema to represent a Resource at South Side Weekly.
 */
const Resource = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  link: { type: String, default: null, required: true },
  teamRoles: [{ type: String, default: null, required: true }],
  visibility: {
    type: String,
    enum: Object.values(visibilityEnum),
    default: visibilityEnum.PRIVATE,
    required: true,
  },
});
export default mongoose.model<ResourceSchema>('Resource', Resource);

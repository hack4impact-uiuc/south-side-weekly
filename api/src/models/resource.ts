import mongoose, { Document } from 'mongoose';
/**
 * Interface for a Resource Schema.
 */
interface IResource extends Document<any> {
  name: string;
  link: string;
  teamRoles: [string];
}
/**
 * Mongoose Schema to represent a Resource at South Side Weekly.
 */
const Resource = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  link: { type: String, default: null, required: true },
  teamRoles: [{ type: String, default: null, required: true }],
});
export default mongoose.model<IResource>('Resource', Resource);
export { IResource };

import mongoose, { Document } from 'mongoose';
import { ITeam } from 'ssw-common';

type TeamSchema = ITeam & Document<any>;

/**
 * Mongoose Schema to represent a Team at South Side Weekly.
 */
const Team = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  active: { type: Boolean, default: true, required: true },
  color: { type: String, default: null, required: true },
});

export default mongoose.model<TeamSchema>('Team', Team);

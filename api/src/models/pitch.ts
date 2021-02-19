import mongoose, { Document } from 'mongoose';

export interface IPitch extends Document<any> {}

const Pitch = new mongoose.Schema({});

export default mongoose.model<IPitch>('Pitch', Pitch);

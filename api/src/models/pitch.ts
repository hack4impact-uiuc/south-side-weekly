import mongoose, { Document } from 'mongoose';

export interface IPitch extends Document<any> {
  name: string;
}

const Pitch = new mongoose.Schema({});

export default mongoose.model<IPitch>('Pitch', Pitch);

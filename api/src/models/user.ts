import mongoose, { Document } from 'mongoose';

interface User extends Document<any> {
  name: string;
}

const User = new mongoose.Schema({
  name: { type: String },
});

export default mongoose.model<User>('User', User);

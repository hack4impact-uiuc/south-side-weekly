import mongoose, { Document } from 'mongoose';

interface IUser extends Document<any> {
  name: string;
}

const User = new mongoose.Schema({
  name: { type: String },
});

export default mongoose.model<IUser>('User', User);
export { IUser };

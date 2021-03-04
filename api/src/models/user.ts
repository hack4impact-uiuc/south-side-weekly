import mongoose, { Document } from 'mongoose';

export const roleEnum = {
  CONTRIBUTOR: 'CONTRIBUTOR',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
};

interface User extends Document<any> {
  name: string;
  role: string;
}

const User = new mongoose.Schema({
  name: { type: String },
  googleId: { type: String },
  role: {
    type: String,
    enum: [roleEnum.CONTRIBUTOR, roleEnum.STAFF, roleEnum.ADMIN],
    required: true,
  },
});

export default mongoose.model<User>('User', User);

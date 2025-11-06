import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    shoulders?: number;
    inseam?: number;
    height?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      shoulders: Number,
      inseam: Number,
      height: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
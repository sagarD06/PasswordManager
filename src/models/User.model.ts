import mongoose, { Schema, Document } from "mongoose";

export interface Password extends Document {
  applicationName: string;
  password: string;
  createdAt?: Date;
}

const PasswordSchema: Schema<Password> = new Schema({
  applicationName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyToken: string;
  verifyTokenExpiry: Date;
  isVerified: boolean;
  mPin : string;
  mPinExpiry : Date;
  mPinAttempts : number;
  passwords: Password[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "Please enter a valid Email address!",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  verifyToken: {
    type: String,
    required: true,
  },
  verifyTokenExpiry: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  mPin : {
    type: String,
    required: true,
  },
  mPinExpiry : {
    type: Date,
    required: true,
  },
  mPinAttempts : {
    type: Number,
    required: true,
    default: 3,
  },
  passwords: {
    type: [PasswordSchema],
    required: true,
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;

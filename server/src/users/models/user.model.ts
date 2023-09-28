import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, require: true },
  com_logo: { type: String },
  about: { type: String },
  com_name: { type: String },
  com_location: { type: String },
  com_phone: { type: String },
  createdAt: { type: String, required: true },
  totalPost: { type: Number, default: 0 },
  cv: {
    avatar: { type: String },
    fullName: { type: String },
    exp: { type: String },
    brief_intro: { type: String },
    education: { type: String },
    major: { type: String },
    address: { type: String },
    phone: { type: String },
    certificates: { type: String },
  },
});

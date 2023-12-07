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
  taxNumber: { type: String },
  createdAt: { type: String, required: true },
  totalPost: { type: Number, default: 0 },
  totalDisplayPosts: { type: Number, default: 0 },
  follow: { type: Array, default: [] },
  subscriber: { type: Array, default: [] },
  cv: {
    avatar: { type: String },
    fullName: { type: String },
    province: { type: String },
    brief_intro: { type: String },
    birthday: { type: String },
    sex: { type: Number, default: 1 },
    level: { type: String },
    education: [
      {
        school: { type: String },
        major: { type: String },
        start: { type: String },
        end: { type: String },
        graded: { type: String },
      },
    ],
    degreeList: [
      {
        degreeName: { type: String },
        result: { type: String },
      },
    ],
    major: { type: String },
    address: { type: String },
    phone: { type: String },
  },
});

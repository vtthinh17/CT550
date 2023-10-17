import * as mongoose from 'mongoose';
export const NotifySchema = new mongoose.Schema({
  action: { type: String },
  fromUserID: { type: String },
  toUserID: { type: String },
  postID: { type: String },
  isViewed: { type: Boolean, default: false },
  timeAt: { type: String },
});

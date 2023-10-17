import { Document } from 'mongoose';

export interface Notify extends Document {
  action: string;
  fromUserID: string;
  toUserID: string;
  postID: string;
  timeAt: string;
}

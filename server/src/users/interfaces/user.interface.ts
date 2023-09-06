import { Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
  createdAt: string;
  role: number;
  uv_address: string;
  uv_phone: string;
  uv_fullname: string;
  uv_major: string;
  com_name: string;
  com_location: string;
  com_phone: string;
}

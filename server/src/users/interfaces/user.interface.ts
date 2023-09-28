import { Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
  createdAt: string;
  role: number;
  cv: {
    avatar: string;
    fullName: string;
    brief_intro: string;
    education: string;
    major: string;
    address: string;
    phone: string;
    exp: string;
    certificates: string;
  };
  com_name: string;
  com_location: string;
  com_phone: string;
  com_logo: string;
}

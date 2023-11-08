import { Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
  createdAt: string;
  role: number;
  birthday: string;
  level: string;
  sex: number;
  cv: {
    avatar: string;
    fullName: string;
    brief_intro: string;
    province: string;
    education: any[];
    degreeList: any[];
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
  subscriber: any[];
  follow: any[];
}

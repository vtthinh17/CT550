import { Document } from 'mongoose';

export interface Post extends Document {
  job_title: string;
  job_links: string;
  job_requirement: string;
  logo: string;
  company: string;
  deadline: string;
  applied: [
    {
      userId: string;
      profile: {
        avatar: string;
        fullName: string;
        brief_intro: string;
        province: string;
        education: any[];
        degreeList: any[];
        major: string;
        address: string;
        phone: string;
      };
    },
  ];
  interviewList: [
    {
      time: [string, string];
      location: string;
      message: string;
      candidateId: string;
    },
  ];
  status: string;
  major: string;
  workingType: string;
  expRequire: string;
  educationRequire: string;
  job_description: string;
  province: string;
  job_benefit: string;
  job_salary: string;
  com_created: string;
  com_location: string;
  com_phone: string;
  createdAt: string;
}

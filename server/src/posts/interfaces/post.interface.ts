import { Document } from 'mongoose';

export interface Post extends Document {
  job_title: string;
  job_links: string;
  job_requirement: string;
  logo: string;
  company: string;
  deadline: string;
  applied: [];
  status: string;
  major: string;
  workingType: string;
  expPrequire: string;
  educationPrequire: string;
  job_description: string;
  job_benefit: string;
  job_salary: string;
  com_created: string;
  com_location: string;
  com_phone: string;
  createdAt: string;
}

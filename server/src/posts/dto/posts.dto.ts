// import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreatePostDto {
  job_title: string;
  job_links: string;
  job_requirement: string;
  logo: string;
  deadline: string;
  company: string;
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

export class UpdatePostDto {
  id: string;
  job_title: string;
  job_links: string;
  job_requirement: string;
  logo: string;
  company: string;
  job_description: string;
  job_benefit: string;
  job_salary: string;
  com_location: string;
  com_phone: string;
  deadline: string;
  createdAt: string;
}

export class ApplyJobDto {
  userId: string;
  profile: object;
}

export class FilterOptionsDto {
  // job_major: string;
  // salary_limit: string;
  working_type: string;
}

// import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreatePostDto {
  job_title: string;
  job_links: string;
  job_requirement: string;
  logo: string;
  deadline: string;
  company: string;
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
  createdAt: string;
}

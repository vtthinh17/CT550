import * as mongoose from 'mongoose';
export const PostSchema = new mongoose.Schema({
  job_title: { type: String, required: true },
  job_links: { type: String },
  job_requirement: { type: String, require: true },
  logo: { type: String },
  company: { type: String },
  deadline: { type: String },
  job_description: { type: String, require: true },
  job_benefit: { type: String, require: true },
  job_salary: { type: String, require: true },
  applied: { type: Number, default: 0 },
  status: { type: Number, default: 0 },
  com_created: { type: String },
  com_location: { type: String },
  com_phone: { type: String },
  createdAt: { type: String },
});

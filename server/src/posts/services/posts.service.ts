import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
// import { CreateUserDto, UpdateUserDto, LoginUserDto } from '../dto/user.dto';
import { Post } from '../interfaces/post.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ApplyJobDto, CreatePostDto } from '../dto/posts.dto';
import { UsersService } from 'src/users/services/users.service';
@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly userService: UsersService,
  ) {}
  async getPost(id: string): Promise<Post> {
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        throw new NotFoundException('Could not find post.');
      }
      return post;
    } catch (error) {
      throw new HttpException('Error get post', HttpStatus.BAD_REQUEST);
    }
  }
  async getPostByFilters(working_type: string) {
    return this.postModel
      .find({
        // job_major: filterOptionsDto.job_major,
        // salary_limit: filterOptionsDto.salary_limit,
        working_type: working_type,
      })
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
  }
  getAllDisplayPosts() {
    return this.postModel
      .find({})
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
  }
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const newPost = new this.postModel({
        job_title: createPostDto.job_title,
        job_requirement: createPostDto.job_requirement,
        job_benefit: createPostDto.job_benefit,
        com_created: createPostDto.com_created,
        job_salary: createPostDto.job_salary,
        deadline: createPostDto.deadline,
        // job_links: createPostDto.job_links,
        // logo: createPostDto.logo,
        // company: createPostDto.company,
        // job_description: createPostDto.job_description,
        // com_location: createPostDto.com_location,
        // com_phone: createPostDto.com_phone,
        createdAt: new Date().getTime(),
      });
      this.userService.increaseTotalPosts(createPostDto.com_created);
      return await newPost.save();
    } catch (error) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }
  }
  async getCompanyPosts(companyId: string) {
    return this.postModel
      .find({ com_created: companyId })
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
  }
  async hidePost(companyId: string) {
    try {
      await this.postModel.findByIdAndUpdate(companyId, {
        status: 2,
      });
    } catch (error) {
      throw new HttpException('Error hide post', HttpStatus.BAD_REQUEST);
    }
  }
  async applyJob(applyJobDto: ApplyJobDto, id: string): Promise<Post> {
    try {
      return await this.postModel.findByIdAndUpdate(id, {
        $push: {
          applied: {
            userId: applyJobDto.userId,
            profile: applyJobDto.profile,
          },
        },
      });
    } catch (error) {
      throw new HttpException('Error apply', HttpStatus.BAD_REQUEST);
    }
  }
  isSubmit(jobId: string, userId: string) {
    try {
      return this.postModel.find({
        _id: jobId,
        applied: { userId: userId },
      });
    } catch (error) {
      throw new HttpException('Error get post ', HttpStatus.BAD_REQUEST);
    }
  }
}

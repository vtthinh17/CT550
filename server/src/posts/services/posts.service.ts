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
import { CreatePostDto } from '../dto/posts.dto';
@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}
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
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const newPost = new this.postModel({
        job_title: createPostDto.job_title,
        // job_links: createPostDto.job_links,
        job_requirement: createPostDto.job_requirement,
        logo: createPostDto.logo,
        company: createPostDto.company,
        job_description: createPostDto.job_description,
        job_benefit: createPostDto.job_benefit,
        deadline: createPostDto.deadline,
        applied: 0,
        status: 0,
        com_created: createPostDto.com_created,
        job_salary: createPostDto.job_salary,
        com_location: createPostDto.com_location,
        com_phone: createPostDto.com_phone,
        createdAt: new Date().getTime(),
      });
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
}

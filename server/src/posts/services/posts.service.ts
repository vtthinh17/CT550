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
import { ApplyJobDto, CreatePostDto, UpdatePostDto } from '../dto/posts.dto';
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
  async getPostByFilters(
    currentPage: number,
    workingType: string,
    educationPrequire: string,
    expPrequire: string,
    major: string,
  ) {
    const filterObject = {
      workingType: workingType,
      educationPrequire: educationPrequire,
      expPrequire: expPrequire,
      major: major,
      status: 1,
    };
    // patch remove empty property
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    // limit 6 items each page
    const skipCount = (currentPage - 1) * 6;
    const post = await this.postModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.postModel.countDocuments();
    return {
      posts: post,
      totalCount: totalCount,
    };
  }
  async getAllDisplayPosts(currentPage: number) {
    // limit 10
    const skipCount = (currentPage - 1) * 9;
    const post = await this.postModel
      .find({ status: 1 })
      .limit(9)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.postModel.countDocuments();
    return {
      posts: post,
      totalCount: totalCount,
    };
  }
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const newPost = new this.postModel({
        major: createPostDto.major,
        expPrequire: createPostDto.expPrequire,
        workingType: createPostDto.workingType,
        educationPrequire: createPostDto.educationPrequire,
        job_title: createPostDto.job_title,
        job_requirement: createPostDto.job_requirement,
        job_benefit: createPostDto.job_benefit,
        com_created: createPostDto.com_created,
        job_salary: createPostDto.job_salary,
        deadline: createPostDto.deadline,
        createdAt: new Date().getTime(),
      });
      this.userService.increaseTotalPosts(createPostDto.com_created);
      return await newPost.save();
    } catch (error) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }
  }
  async updatePost(updatePostDto: UpdatePostDto, id: string): Promise<Post> {
    try {
      return await this.postModel.findByIdAndUpdate(id, {
        $set: {
          job_title: updatePostDto.job_title,
          job_requirement: updatePostDto.job_requirement,
          job_benefit: updatePostDto.job_benefit,
          job_salary: updatePostDto.job_salary,
          deadline: updatePostDto.deadline,
        },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
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
  async getOutDatePosts() {
    const date = new Date();
    // dd-MM-yyyy
    const today = new Date(
      `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
    );
    const posts = await this.postModel.find({ status: 1 }).then((post) => {
      return post;
    });
    posts.forEach(async (element) => {
      if (element.com_created) {
        const elementDateFormat = {
          ngay: Number(element.deadline.slice(0, 4)),
          thang: Number(element.deadline.slice(5, 7)),
          nam: Number(element.deadline.slice(8)),
        };
        // dd-MM-yyyy
        const elementDate = new Date(
          `${elementDateFormat.ngay}-${elementDateFormat.thang}-${elementDateFormat.nam}`,
        );
        const time1 = elementDate.getTime();
        const time2 = today.getTime();
        if (time1 < time2) {
          try {
            await this.postModel.findByIdAndUpdate(element._id, {
              $set: {
                status: 2,
              },
            });
            console.log(element);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('All post are up-to-date');
        }
      } else {
        const elementDate = new Date(element.deadline);
        const time1 = elementDate.getTime();
        const time2 = today.getTime();
        if (time1 < time2) {
          try {
            await this.postModel.findByIdAndUpdate(element._id, {
              $set: {
                status: 2,
              },
            });
            console.log(element);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('All post are up-to-date');
        }
      }
    });
  }
}

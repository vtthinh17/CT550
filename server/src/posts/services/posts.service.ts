import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Post } from '../interfaces/post.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApplyJobDto,
  CreatePostDto,
  UpdatePostDto,
  AddInterviewDto,
} from '../dto/posts.dto';
import { UsersService } from 'src/users/services/users.service';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import * as moment from 'moment';

// import * as dayjs from 'dayjs';
@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly notifyService: NotificationsService,
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
  async deletePost(id: string) {
    try {
      const post = await this.postModel.findById(id);
      await this.postModel.findByIdAndDelete(id);
      await this.userService.decreaseTotalPost(post.com_created);
      await this.userService.decreaseTotalDisplayPost(post.com_created);
    } catch (error) {
      throw new HttpException('Error get post', HttpStatus.BAD_REQUEST);
    }
  }

  getAllPosts(): any {
    const ab = this.postModel
      .find({})
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    return ab;
  }

  async getAppliedPost(userId: string) {
    try {
      const abc = [];
      const posts = await this.postModel.find({ status: { $in: [1, 2] } });
      Object.values(posts).forEach((element) => {
        element.applied.forEach((applied) => {
          if (applied.userId == userId) {
            abc.push(element);
          }
        });
      });
      return abc;
    } catch (error) {
      throw new HttpException('Error get post', HttpStatus.BAD_REQUEST);
    }
  }
  async getPostByFilters(
    currentPage: number,
    workingType: string,
    educationRequire: string,
    expRequire: string,
    province: string,
    major: string,
    salary: string,
  ) {
    const filterObject = {
      workingType: workingType,
      educationRequire: educationRequire,
      expRequire: expRequire,
      province: province,
      status: 1,
      com_created: { $exists: true },
    };
    if (major !== '') {
      filterObject['major'] = {
        $regex: major,
        $options: 'i',
      };
    } else {
      filterObject['major'] = undefined;
    }
    if (salary !== '') {
      if (salary === 'Th') {
        filterObject['job_salary'] = {
          $regex: /(Th)|(Cạnh)|(Khác)|(Trao)/,
          $options: 'i',
        };
      } else if (salary === '3 - 6') {
        filterObject['job_salary'] = {
          $regex:
            /^([3-5](.[0-9])?( triệu)?( -)?)|(^[3-5]( triệu)?)|(^Trên [3-5]( triệu)?)|(Trên [3-5](.[0-9])?( triệu)?)|(- [3-6] triệu)/,
          $options: 'i',
        };
      } else if (salary === '6 - 10') {
        filterObject['job_salary'] = {
          $regex:
            /([6-9](.[0-9])? triệu - 10 triệu)|([6-9](.[0-9])? - 10 triệu)/,
          $options: 'i',
        };
      } else if (salary === 'duoi10') {
        filterObject['job_salary'] = {
          $regex:
            /([0-9] triệu - 10 triệu)|([0-9] triệu - [0-9] triệu)|([0-9].[0-9] triệu - [0-9].[0-9] triệu)|([0-9](.[0-9])? - 10 triệu)|([0-9](.[0-9])? - [0-9](.[0-9])? triệu)|([0-9](.[0-9])? triệu - 10 triệu)|([0-9](.[0-9])? triệu - [0-9](.[0-9])? triệu)/,
          $options: 'i',
        };
      } else if (salary === 'tren10') {
        filterObject['job_salary'] = {
          $regex:
            /([1-9][0-9] triệu - )|([1-9][0-9](.[0-9])? triệu - )|(Trên 1[0-9] triệu)|([1-9][0-9] - )|([1-9][0-9](.[0-9])? triệu - )/,
          $options: 'i',
        };
      } else if (salary === '10 - 15') {
        filterObject['job_salary'] = {
          $regex:
            /(1[0-5] triệu - 1[1-5] triệu)|(1[0-5] - 1[0-5] triệu)|(Trên 1[0-4] triệu)|(1[0-5](.[0-9])? triệu - 1[1-5] triệu)/,
          $options: 'i',
        };
      } else if (salary === '15 - 20') {
        filterObject['job_salary'] = {
          $regex:
            /(1[5-9] triệu - 20 triệu)|(1[5-9] - 20 triệu)|(1[5-9] triệu - 1[5-9] triệu)|(1[5-9] - 1[5-9] triệu)|(1[5-9](.[0-9])? triệu - 1[5-9] triệu)|(1[5-9] - 1[5-9] triệu)|(1[5-9](.[0-9])? triệu - 20 triệu)|(1[5-9](.[0-9])? - 20 triệu)|(Trên 1[5-9] triệu)/,
          $options: 'i',
        };
      } else if (salary === 'tren20') {
        filterObject['job_salary'] = {
          $regex:
            /([2-9][0-9] triệu - )|([2-9][0-9](.[0-9])? triệu - )|(Trên 2[0-9] triệu)|([2-9][0-9] - )|([2-9][0-9](.[0-9])? triệu - )/,
          $options: 'i',
        };
      } else {
        filterObject['job_salary'] = {
          $regex: salary,
          $options: 'i',
        };
      }
    } else {
      filterObject['job_salary'] = undefined;
    }
    // patch remove empty property
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    // limit 6 items each fetch
    const skipCount = (currentPage - 1) * 6;
    const post = await this.postModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.postModel.find(filterObject).countDocuments();
    return {
      posts: post,
      totalCount: totalCount,
    };
  }
  async getReferPostByFilter(
    currentReferPage: number,
    hinhthuc: string,
    trinhdo: string,
    thanhpho: string,
    kinhnghiem: string,
    linhvuc: string,
    mucluong: string,
  ) {
    const filterObject = {
      status: 1,
      job_link: { $exists: true },
    };
    if (hinhthuc !== undefined) {
      filterObject['workingType'] = {
        $regex: hinhthuc,
        $options: 'i',
      };
    }
    if (trinhdo !== undefined) {
      filterObject['educationRequire'] = {
        $regex: trinhdo,
        $options: 'i',
      };
    }
    if (thanhpho !== undefined) {
      filterObject['province'] = {
        $regex: thanhpho,
        $options: 'i',
      };
    }
    if (kinhnghiem !== undefined) {
      if (kinhnghiem === '0') {
        filterObject['expRequire'] = {
          $regex: /(Không)|(Chưa)|(0)/,
          $options: 'i',
        };
      } else {
        filterObject['expRequire'] = {
          $regex: kinhnghiem,
          $options: 'i',
        };
      }
    }
    if (linhvuc !== '') {
      filterObject['major'] = {
        $regex: linhvuc,
        $options: 'i',
      };
    } else {
      filterObject['major'] = undefined;
    }
    if (mucluong !== '') {
      if (mucluong === 'Th') {
        filterObject['job_salary'] = {
          $regex: /(Th)|(Cạnh)|(Khác)|(Trao)/,
          $options: 'i',
        };
      } else if (mucluong === '3 - 6') {
        filterObject['job_salary'] = {
          $regex:
            /^([3-5](.[0-9])?( triệu)?( -)?)|(^[3-5]( triệu)?)|(^Trên [3-5]( triệu)?)|(Trên [3-5](.[0-9])?( triệu)?)|(- [3-6] triệu)/,
          $options: 'i',
        };
      } else if (mucluong === '6 - 10') {
        filterObject['job_salary'] = {
          $regex:
            /([6-9](.[0-9])? triệu - 10 triệu)|([6-9](.[0-9])? - 10 triệu)/,
          $options: 'i',
        };
      } else if (mucluong === 'duoi10') {
        filterObject['job_salary'] = {
          $regex:
            /([0-9] triệu - 10 triệu)|([0-9] triệu - [0-9] triệu)|([0-9].[0-9] triệu - [0-9].[0-9] triệu)|([0-9](.[0-9])? - 10 triệu)|([0-9](.[0-9])? - [0-9](.[0-9])? triệu)|([0-9](.[0-9])? triệu - 10 triệu)|([0-9](.[0-9])? triệu - [0-9](.[0-9])? triệu)/,
          $options: 'i',
        };
      } else if (mucluong === 'tren10') {
        filterObject['job_salary'] = {
          $regex:
            /([1-9][0-9] triệu - )|([1-9][0-9](.[0-9])? triệu - )|(Trên 1[0-9] triệu)|([1-9][0-9] - )|([1-9][0-9](.[0-9])? triệu - )/,
          $options: 'i',
        };
      } else if (mucluong === '10 - 15') {
        filterObject['job_salary'] = {
          $regex:
            /(1[0-5] triệu - 1[1-5] triệu)|(1[0-5] - 1[0-5] triệu)|(Trên 1[0-4] triệu)|(1[0-5](.[0-9])? triệu - 1[1-5] triệu)/,
          $options: 'i',
        };
      } else if (mucluong === '15 - 20') {
        filterObject['job_salary'] = {
          $regex:
            /(1[5-9] triệu - 20 triệu)|(1[5-9] - 20 triệu)|(1[5-9] triệu - 1[5-9] triệu)|(1[5-9] - 1[5-9] triệu)|(1[5-9](.[0-9])? triệu - 1[5-9] triệu)|(1[5-9] - 1[5-9] triệu)|(1[5-9](.[0-9])? triệu - 20 triệu)|(1[5-9](.[0-9])? - 20 triệu)|(Trên 1[5-9] triệu)/,
          $options: 'i',
        };
      } else if (mucluong === 'tren20') {
        filterObject['job_salary'] = {
          $regex:
            /([2-9][0-9] triệu - )|([2-9][0-9](.[0-9])? triệu - )|(Trên 2[0-9] triệu)|([2-9][0-9] - )|([2-9][0-9](.[0-9])? triệu - )/,
          $options: 'i',
        };
      } else {
        filterObject['job_salary'] = {
          $regex: mucluong,
          $options: 'i',
        };
      }
    } else {
      filterObject['job_salary'] = undefined;
    }
    // patch remove empty property
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    // limit 6 items each fetch
    const skipCount = (currentReferPage - 1) * 6;
    const post = await this.postModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.postModel.find(filterObject).countDocuments();
    return {
      posts: post,
      totalReferCount: totalCount,
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
  async getSysTemPosts(currentPage: number) {
    const filterObject = {
      com_created: { $exists: true },
    };
    // patch remove empty property
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    // limit 6 items each fetch
    const skipCount = (currentPage - 1) * 6;
    const post = await this.postModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.postModel.find(filterObject).countDocuments();
    return {
      posts: post,
      totalCount: totalCount,
    };
  }
  async getReferPosts(currentReferPage: number) {
    const filterObject = {
      job_link: { $exists: true },
    };
    // patch remove empty property
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    // limit 6 items each fetch
    const skipCount = (currentReferPage - 1) * 6;
    const post = await this.postModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.postModel.find(filterObject).countDocuments();
    return {
      posts: post,
      totalReferCount: totalCount,
    };
  }
  async getUnApprovedPosts(currentPage: number) {
    const filterObject = {
      status: 0,
    };
    // patch remove empty property
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    // limit 6 items each fetch
    const skipCount = (currentPage - 1) * 6;
    const post = await this.postModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.postModel.find(filterObject).countDocuments();
    return {
      posts: post,
      totalCount: totalCount,
    };
  }
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const date = new Date();
    const temp = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    try {
      const newPost = new this.postModel({
        major: createPostDto.major,
        expRequire: createPostDto.expRequire,
        workingType: createPostDto.workingType,
        educationRequire: createPostDto.educationRequire,
        job_title: createPostDto.job_title,
        job_requirement: createPostDto.job_requirement,
        job_benefit: createPostDto.job_benefit,
        job_description: createPostDto.job_description,
        com_created: createPostDto.com_created,
        job_salary: createPostDto.job_salary,
        deadline: createPostDto.deadline,
        province: createPostDto.province,
        createdAt: temp,
      });
      this.userService.increaseTotalPosts(createPostDto.com_created);
      await newPost.save();
      await this.notifyService.sendNotiToSubScriber(createPostDto.com_created);
      return newPost;
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
          job_description: updatePostDto.job_description,
          job_salary: updatePostDto.job_salary,
          deadline: updatePostDto.deadline,
          major: updatePostDto.major,
          workingType: updatePostDto.workingType,
          expRequire: updatePostDto.expRequire,
          educationRequire: updatePostDto.educationRequire,
        },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }
  async getCompanyPosts(currentReferPage: number, companyId: string) {
    const filterObject = {
      com_created: companyId,
    };
    // patch remove empty property
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    // limit 6 items each fetch
    const skipCount = (currentReferPage - 1) * 6;
    const post = await this.postModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.postModel.find(filterObject).countDocuments();
    return {
      posts: post,
      totalCount: totalCount,
    };
  }
  async getCompanyActivePosts(currentReferPage: number, companyId: string) {
    const filterObject = {
      com_created: companyId,
      status: 1,
    };
    // patch remove empty property
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    // limit 6 items each fetch
    const skipCount = (currentReferPage - 1) * 6;
    const post = await this.postModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.postModel.find(filterObject).countDocuments();
    return {
      posts: post,
      totalCount: totalCount,
    };
  }
  async changePostStatus(postId: string, updatePostDto: UpdatePostDto) {
    const temp = await this.postModel.findById(postId);
    try {
      await this.postModel.findByIdAndUpdate(postId, {
        status: updatePostDto.status,
      });
      if (updatePostDto.status == 1) {
        try {
          await this.userService.increaseTotalDisplayPost(temp.com_created);
        } catch (error) {
          console.log(error);
          throw new HttpException('Error hide post', HttpStatus.BAD_REQUEST);
        }
      } else {
        try {
          await this.userService.decreaseTotalDisplayPost(temp.com_created);
        } catch (error) {
          console.log(error);
          throw new HttpException('Error hide post', HttpStatus.BAD_REQUEST);
        }
      }
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
  async removeApply(userId: string, postId: string): Promise<Post> {
    try {
      return await this.postModel.findByIdAndUpdate(postId, {
        $pull: {
          applied: {
            userId: userId,
          },
        },
      });
    } catch (error) {
      throw new HttpException('Error apply', HttpStatus.BAD_REQUEST);
    }
  }
  async addInterview(addInterviewDto: AddInterviewDto, postId: string) {
    try {
      return await this.postModel.findByIdAndUpdate(postId, {
        $push: {
          interviewList: {
            time: addInterviewDto.time,
            candidateId: addInterviewDto.candidateId,
            location: addInterviewDto.location,
            message: addInterviewDto.message,
          },
        },
      });
      // add Notify to candidate about this interview
    } catch (error) {
      throw new HttpException('Error apply', HttpStatus.BAD_REQUEST);
    }
  }

  async removeInterview(userId: string, postId: string) {
    try {
      const ab = await this.postModel.findById(postId);
      const newDegreeList = ab.interviewList.filter(
        (interviewItem) => interviewItem['candidateId'] !== userId,
      );
      return await this.postModel.findByIdAndUpdate(postId, {
        $set: {
          interviewList: newDegreeList,
        },
      });
      // add Notify to candidate about this interview
    } catch (error) {
      throw new HttpException('Error apply', HttpStatus.BAD_REQUEST);
    }
  }

  async editInterview(addInterviewDto: AddInterviewDto, postId: string) {
    try {
      const ab = await this.postModel.findById(postId);
      ab.interviewList.forEach((element) => {
        if (element.candidateId == addInterviewDto.candidateId) {
          element.location = addInterviewDto.location;
          element.message = addInterviewDto.message;
          element.time = addInterviewDto.time;
        }
      });
      return await this.postModel.findByIdAndUpdate(postId, {
        $set: {
          interviewList: ab.interviewList,
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
    const todayValue = new Date();
    const posts = await this.postModel.find({ status: 1 }).then((post) => {
      return post;
    });
    posts.forEach(async (element) => {
      if (element.deadline) {
        const elementDateValue = moment(
          element.deadline,
          'DD/MM/YYYY',
        ).toDate();
        if (elementDateValue < todayValue) {
          try {
            await this.postModel.findByIdAndUpdate(element._id, {
              $set: {
                status: 2,
              },
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
    console.log('All posts are up-to-date');
  }

  async getSuitableJobs(userId: string) {
    const user = await this.userService.getUser(userId);
    // const eduList = [];
    // user.cv.education.forEach((edu) => {
    //   eduList.push(`(${edu.major})`);
    // });
    const filterObject = {
      status: 1,
      province: user.cv.province,
    };
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    const post = await this.postModel
      .find(filterObject)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    return {
      posts: post,
    };
  }
}

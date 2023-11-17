import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginUserDto,
  InsertCVDto,
  ChangePasswordDto,
} from '../dto/user.dto';
import { User } from '../interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PostsService } from 'src/posts/services/posts.service';
import { PusherService } from 'src/pusher/pusher.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => PostsService)) private postService: PostsService,
    private pusherService: PusherService,
  ) {}
  async follow(fromUserID: string, toUserID: string) {
    try {
      await this.userModel.findByIdAndUpdate(fromUserID, {
        $push: { follow: toUserID },
      });
      await this.userModel.findByIdAndUpdate(toUserID, {
        $push: { subscriber: fromUserID },
      });
      await this.pusherService.trigger(
        'recruitment-system',
        `follow-${toUserID}`,
        {
          userId: fromUserID,
          companyId: toUserID,
        },
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error handle follow user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async unfollow(userId: string, unfollowId: string) {
    try {
      await this.userModel.findByIdAndUpdate(userId, {
        $pull: { follow: { $eq: unfollowId } },
      });
      await this.userModel.findByIdAndUpdate(unfollowId, {
        $pull: { subscriber: { $eq: userId } },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }
  async getUser(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('Could not find user.');
      }
      return user;
    } catch (error) {
      throw new HttpException('Error get user', HttpStatus.BAD_REQUEST);
    }
  }
  getAllUsers(): any {
    const ab = this.userModel
      .find({})
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    return ab;
  }

  getCandidates() {
    return this.userModel
      .find({
        role: '1',
        'cv.fullName': { $exists: true },
      })
      .then((candidate) => {
        return candidate;
      })
      .catch((err) => console.log(err));
  }
  async getTodayCreatedAccount() {
    let count = 0;
    const today = new Date();
    const allUser = await this.getAllUsers();
    allUser.forEach((user) => {
      if (user.createdAt.slice(0, 2) == today.getDate()) {
        count++;
      }
    });
    return count;
  }
  async login(loginUserDto: LoginUserDto): Promise<User> {
    try {
      const user = await this.userModel.findOne(loginUserDto);
      if (!user) {
        throw new NotFoundException('Could not find user.');
      }
      return user;
    } catch (error) {
      throw new HttpException('Error get user', HttpStatus.BAD_REQUEST);
    }
  }

  async increaseTotalDisplayPost(id: string) {
    try {
      return await this.userModel.findByIdAndUpdate(id, {
        $inc: { totalDisplayPosts: 1 },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  async decreaseTotalDisplayPost(id: string) {
    try {
      return await this.userModel.findByIdAndUpdate(id, {
        $inc: { totalDisplayPosts: -1 },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  async decreaseTotalPost(id: string) {
    try {
      return await this.userModel.findByIdAndUpdate(id, {
        $inc: { totalPost: -1 },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const date = new Date();
      const temp = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      const newUser = new this.userModel({
        username: createUserDto.username,
        password: createUserDto.password,
        role: createUserDto.role,
        com_name: createUserDto.com_name,
        com_location: createUserDto.com_location,
        com_phone: createUserDto.com_phone,
        taxNumber: createUserDto.taxNumber,
        createdAt: temp,
        cv: createUserDto.cv,
      });
      return await newUser.save();
    } catch (error) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    try {
      const userModel = await this.userModel.findById(id);
      const education = userModel.cv;
      // const degree = userModel.cv.degreeList;
      return await this.userModel.findByIdAndUpdate(id, {
        $set: {
          ...education,
          cv: {
            ...education,
            avatar: updateUserDto.avatar,
            fullName: updateUserDto.fullName,
            brief_intro: updateUserDto.brief_intro,
            address: updateUserDto.address,
            phone: updateUserDto.phone,
            sex: updateUserDto.sex,
            birthday: updateUserDto.birthday,
            level: updateUserDto.level,
            province: updateUserDto.province,
          },
        },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  async updateCompany(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    try {
      if (updateUserDto.about === '') {
        return await this.userModel.findByIdAndUpdate(id, {
          $set: {
            com_logo: updateUserDto.com_logo,
            com_location: updateUserDto.com_location,
            com_name: updateUserDto.com_name,
            com_phone: updateUserDto.com_phone,
          },
        });
      } else {
        return await this.userModel.findByIdAndUpdate(id, {
          $set: {
            com_logo: updateUserDto.com_logo,
            com_location: updateUserDto.com_location,
            com_name: updateUserDto.com_name,
            com_phone: updateUserDto.com_phone,
            about: updateUserDto.about,
          },
        });
      }
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  async increaseTotalPosts(id: string) {
    try {
      return await this.userModel.findByIdAndUpdate(id, {
        $inc: { totalPost: 1 },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  async insertEducation(insertCVDto: InsertCVDto, id: string): Promise<User> {
    try {
      const userModel = await this.userModel.findById(id);
      const education = userModel.cv.education;
      return await this.userModel.findByIdAndUpdate(id, {
        $set: {
          cv: {
            ...userModel.cv,
            education: [
              ...education,
              {
                school: insertCVDto.school,
                major: insertCVDto.major,
                start: insertCVDto.start,
                end: insertCVDto.end,
                graded: insertCVDto.graded,
              },
            ],
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  async removeEducationInfo(id: string, eduId: string) {
    const userModel = await this.userModel.findById(id);
    try {
      const newEducation = userModel.cv.education.filter(
        (edu) => edu._id.toString() !== eduId,
      );
      return await this.userModel.findByIdAndUpdate(id, {
        $set: {
          cv: {
            ...userModel.cv,
            education: newEducation,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Error remove edu', HttpStatus.BAD_REQUEST);
    }
  }

  async insertDegree(insertCVDto: InsertCVDto, id: string): Promise<User> {
    try {
      const userModel = await this.userModel.findById(id);
      const degreeList = userModel.cv.degreeList;
      return await this.userModel.findByIdAndUpdate(id, {
        $set: {
          cv: {
            ...userModel.cv,
            degreeList: [
              ...degreeList,
              {
                degreeName: insertCVDto.degreeName,
                result: insertCVDto.result,
              },
            ],
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  async removeDegreeInfo(id: string, degreeId: string) {
    const userModel = await this.userModel.findById(id);
    try {
      const newDegreeList = userModel.cv.degreeList.filter(
        (degree) => degree._id.toString() !== degreeId,
      );
      return await this.userModel.findByIdAndUpdate(id, {
        $set: {
          cv: {
            ...userModel.cv,
            degreeList: newDegreeList,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Error remove edu', HttpStatus.BAD_REQUEST);
    }
  }

  async insertCV(insertCVDto: InsertCVDto, id: string): Promise<User> {
    try {
      console.log(insertCVDto);
      return await this.userModel.findByIdAndUpdate(id, {
        $set: {
          cv: {
            avatar: insertCVDto.avatar,
            fullName: insertCVDto.fullName,
            brief_intro: insertCVDto.brief_intro,
            province: insertCVDto.province,
            birthday: insertCVDto.birthday,
            level: insertCVDto.level,
            sex: insertCVDto.sex,
            address: insertCVDto.address,
            phone: insertCVDto.phone,
            certificates: insertCVDto.certificates,
          },
        },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(deleteUserId: string): Promise<any> {
    try {
      const user = await this.userModel.findById(deleteUserId);
      user.follow.forEach(async (comId) => {
        await this.unfollow(deleteUserId, comId);
      });
      const postThatUserApplied = await this.postService.getAppliedPost(
        deleteUserId,
      );
      postThatUserApplied.forEach((post) => {
        // xoa danh sach applied
        this.postService.removeApply(deleteUserId, post._id);
        // xoa lich hen phong van
        this.postService.removeInterview(deleteUserId, post._id);
      });
      // xoa nguoi dung
      await this.userModel.deleteOne({ _id: deleteUserId });
    } catch (error) {
      throw new HttpException('Error deleting article', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllCompanies(currentPage: number) {
    const filterObject = {
      role: '2',
    };
    // patch remove empty property
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });
    // limit 6 items each fetch
    const skipCount = (currentPage - 1) * 6;
    const data = await this.userModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.userModel.find(filterObject).countDocuments();
    return {
      users: data,
      totalCount: totalCount,
    };
  }

  async getAllCandidates(
    currentPage: number,
    gender: number,
    educationRequire: string,
    province: string,
  ) {
    const filterObject = {
      role: '1',
      'cv.sex': gender,
      'cv.province': province,
      'cv.level': educationRequire,
    };
    Object.keys(filterObject).forEach((key) => {
      if (filterObject[key] === undefined) {
        delete filterObject[key];
      }
    });

    // limit 6 items each fetch
    const skipCount = (currentPage - 1) * 6;
    const data = await this.userModel
      .find(filterObject)
      .limit(6)
      .skip(skipCount)
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
    const totalCount = await this.userModel.find(filterObject).countDocuments();
    return {
      users: data,
      totalCount: totalCount,
    };
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    id: string,
  ): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(id, {
        $set: { password: changePasswordDto.password },
      });
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }
}

/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto, LoginUserDto, InsertCVDto, ChangePasswordDto } from '../dto/user.dto';
import { User } from '../interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose'
@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }
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
    };

    getCandidates() {
        return this.userModel
            .find({
                role: '1',
                "cv.fullName":
                    { $exists: true }

            })
            .then((candidate) => {
                return candidate;
            })
            .catch((err) => console.log(err));
    };

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
    };

    getAllUsers() {
        return this.userModel.find({})
            .then((user) => {
                return user;
            })
            .catch(
                (err) => console.log(err)
            )
    };

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const newUser = new this.userModel({
                username: createUserDto.username,
                password: createUserDto.password,
                role: createUserDto.role,
                com_name: createUserDto.com_name,
                com_location: createUserDto.com_location,
                com_phone: createUserDto.com_phone,
                taxNumber: createUserDto.taxNumber,
                createdAt: new Date().getTime(),
                cv: createUserDto.cv,
            })
            console.log("tao user", newUser)
            return await newUser.save()
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
                    }
                }
            }
            );
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
                    }
                }
                );
            } else {
                return await this.userModel.findByIdAndUpdate(id, {
                    $set: {
                        com_logo: updateUserDto.com_logo,
                        com_location: updateUserDto.com_location,
                        com_name: updateUserDto.com_name,
                        com_phone: updateUserDto.com_phone,
                        about: updateUserDto.about
                    }
                }
                );
            }

        } catch (error) {
            throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        }
    }

    async increaseTotalPosts(id: string) {
        try {
            return await this.userModel.findByIdAndUpdate(id, { $inc: { totalPost: 1, } }
            );
        } catch (error) {
            throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        }
    }

    async follow(fromUserID: string, toUserID: string) {
        try {
            await this.userModel.findByIdAndUpdate(fromUserID, { $push: { follow: toUserID } });
            await this.userModel.findByIdAndUpdate(toUserID, { $push: { subscriber: fromUserID } });
        } catch (error) {
            throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        }
    }
    async insertEducation(insertCVDto: InsertCVDto, id: string): Promise<User> {
         try {
            console.log("them edu", insertCVDto);
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
                            }
                        ]
                    }
                }
            }
            );
        } catch (error) {
            console.log(error);
            throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        }
        // try {
        //     console.log("them edu", insertCVDto);
        //     const userModel = await this.userModel.findById(id);
        //     const education = userModel.cv.education;
        //     return await this.userModel.findByIdAndUpdate(id, {
        //         $set: {
        //             cv: {
        //                 ...userModel.cv,
        //                 education: [
        //                     ...education,
        //                     {
        //                         school: insertCVDto.school,
        //                         major: insertCVDto.major,
        //                         start: insertCVDto.start,
        //                         end: insertCVDto.end,
        //                         graded: insertCVDto.graded,
        //                     }
        //                 ]
        //             }
        //         }
        //     }
        //     );
        // } catch (error) {
        //     console.log(error);
        //     throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        // }
    }

    async removeEducationInfo(id: string, eduId: string) {
        const userModel = await this.userModel.findById(id);
        try {
            const newEducation = userModel.cv.education.filter((edu) => edu._id.toString() !== eduId);
            return await this.userModel.findByIdAndUpdate(id, {
                $set: {
                    cv: {
                        ...userModel.cv,
                        education: newEducation
                    }
                }
            });
        } catch (error) {
            console.log("loi>", error);
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
                            }
                        ]
                    }
                }
            }
            );
        } catch (error) {
            console.log(error);
            throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        }
    }

    async removeDegreeInfo(id: string, degreeId: string) {
        const userModel = await this.userModel.findById(id);
        try {
            const newDegreeList = userModel.cv.degreeList.filter((degree) => degree._id.toString() !== degreeId);
            return await this.userModel.findByIdAndUpdate(id, {
                $set: {
                    cv: {
                        ...userModel.cv,
                        degreeList: newDegreeList
                    }
                }
            });
        } catch (error) {
            console.log("loi>", error);
            throw new HttpException('Error remove edu', HttpStatus.BAD_REQUEST);
        }
    }

    async insertCV(insertCVDto: InsertCVDto, id: string): Promise<User> {
        try {
            console.log(insertCVDto)
            return await this.userModel.findByIdAndUpdate(id, {
                $set: {
                    "cv": {
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
                    }
                }


            });
        } catch (error) {
            throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        }
    }

    async deleteUser(id: string): Promise<any> {
        try {
            return this.userModel.deleteOne({ "_id": id });
        } catch (error) {
            throw new HttpException('Error deleting article', HttpStatus.BAD_REQUEST);
        }
    }

    getAllCompanies() {
        return this.userModel
            .find({ role: '2' })
            .then((post) => {
                return post;
            })
            .catch((err) => console.log(err));
    }

    async changePassword(changePasswordDto: ChangePasswordDto, id: string): Promise<User> {
        try {

            return await this.userModel.findByIdAndUpdate(id, {
                $set: { "password": changePasswordDto.password, }


            });
        } catch (error) {
            throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        }
    }
    async unfollow(userId: string, unfollowId: string) {
        // console.log(unfollowId)
        try {
            await this.userModel.findByIdAndUpdate(userId, {
                $pull: { follow: { $eq: unfollowId } }
            });
            await this.userModel.findByIdAndUpdate(unfollowId, {
                $pull: { subscriber: { $eq: userId } }
            });
        } catch (error) {
            throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        }
    }
}

/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from '../dto/user.dto';
import { User } from '../interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose'
@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
    ) { }
    // Use: Login, Get user to view profile
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
    // Use: Login, Get user to view profile
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
    // Done
    getAllUsers() {
        return this.userModel.find({})
            .then((user) => {
                return user;
            })
            .catch(
                (err) => console.log(err)
            )
    };
    // Use: Register
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const newUser = new this.userModel({
                username: createUserDto.username,
                password: createUserDto.password,
                role: createUserDto.role,
                uv_address: createUserDto.uv_address,
                uv_phone: createUserDto. uv_phone,
                uv_fullname: createUserDto.uv_fullname,
                uv_major: createUserDto.uv_major,
                com_name: createUserDto.com_name,
                com_location: createUserDto.com_location,
                com_phone: createUserDto.com_phone,
                createdAt: new Date().getTime(),
            })
            return await newUser.save()
        } catch (error) {
            throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
        }
    }
    async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
        try {
            
            return await this.userModel.findByIdAndUpdate(id, {
                com_name:updateUserDto.com_name,
                com_location:updateUserDto.com_location,
                com_phone: updateUserDto.com_phone,
            });
        } catch (error) {
            throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
        }
    }
    // Done
    async deleteUser(id: string): Promise<any> {
        try {
            return this.userModel.deleteOne({ "_id": id });
        } catch (error) {
            throw new HttpException('Error deleting article', HttpStatus.BAD_REQUEST);
        }
    }
}

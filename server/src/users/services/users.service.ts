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
                createdAt: new Date().getTime(),
            })
            return await newUser.save()
        } catch (error) {
            throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
        }
    }
    // Done
    async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
        try {
            const user = await this.getUser(id);
            user.username = updateUserDto.username;
            user.password = updateUserDto.password;
            return await user.save();
        } catch (error) {
            throw new HttpException('Error updating article', HttpStatus.BAD_REQUEST);
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
